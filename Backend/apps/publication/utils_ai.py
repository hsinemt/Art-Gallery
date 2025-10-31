from __future__ import annotations
import os
import logging

logger = logging.getLogger(__name__)


def summarize_text(text: str) -> str | None:
    """Summarize text using Google Generative AI if configured.
    Reads API key from env GOOGLE_API_KEY. Returns summary or None.
    Based on ok.py logic provided by user.
    """
    if not text:
        return None
    # Try python-decouple first, then env var
    api_key = None
    try:
        from decouple import config  # type: ignore
        api_key = config('GOOGLE_API_KEY', default=None)
    except Exception:
        api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        return None
    try:
        import google.generativeai as genai  # type: ignore
    except Exception:
        logger.warning("google-generativeai not installed")
        return None

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = (
            "You are a helpful assistant that summarizes feedback clearly.\n\n"
            "Provide a short summary highlighting: main positive and negative points, overall sentiment, and suggestions for improvement.\n\n"
            f"Here is the text you need to summarize:\n{text}"
        )
        response = model.generate_content(prompt)
        return getattr(response, 'text', None)
    except Exception as exc:
        logger.warning("AI summarize error: %s", exc)
        return None

