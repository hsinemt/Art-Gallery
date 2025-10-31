import logging
import os
from pathlib import Path
from urllib.parse import quote_plus
import requests
from django.conf import settings
from django.core.files.base import ContentFile


logger = logging.getLogger(__name__)


def generate_image_from_description(description: str) -> ContentFile | None:
    """
    Generates an image using the Pollinations endpoint based on the description.
    Returns a Django ContentFile ready to assign to an ImageField, or None on failure.
    """
    if not description:
        return None

    # First try the provided TRY.py generator (writes image.png to CWD)
    try:
        from .ai.TRY import generate as try_generate  # type: ignore
        try_generate(description)
        # Attempt to read the generated file from BASE_DIR
        base_dir = Path(getattr(settings, 'BASE_DIR', Path.cwd()))
        candidate = base_dir / 'image.png'
        if candidate.exists():
            data = candidate.read_bytes()
            # Clean up the temp file to avoid accumulation
            try:
                candidate.unlink(missing_ok=True)
            except Exception:
                pass
            if data:
                return ContentFile(data)
    except Exception as exc:
        logger.warning("TRY.py generation path failed: %s", exc)

    # Fallback to direct HTTP fetch if TRY.py not available or failed
    try:
        encoded = quote_plus(description)
        url = f"https://image.pollinations.ai/prompt/{encoded}"

        resp = requests.get(
            url,
            timeout=25,
            headers={
                "User-Agent": "ArtGalleryBot/1.0 (+https://example.local)",
                "Accept": "image/*,application/octet-stream;q=0.9,*/*;q=0.8",
            },
        )

        if not resp.ok:
            logger.warning("Image gen failed: status=%s url=%s", resp.status_code, url)
            return None

        content_type = resp.headers.get("Content-Type", "")
        if not content_type.startswith("image/"):
            logger.warning("Image gen invalid content-type: %s", content_type)
            return None

        data = resp.content
        if not data:
            logger.warning("Image gen empty body")
            return None

        return ContentFile(data)
    except Exception as exc:
        logger.exception("Image generation error: %s", exc)
        return None

