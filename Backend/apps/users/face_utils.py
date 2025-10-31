import io
from typing import List, Optional

try:
    import face_recognition
except Exception:
    face_recognition = None

try:
    import cv2
    import numpy as _np
except Exception:
    cv2 = None
    _np = None


def _raise_face_recognition_missing():
    raise RuntimeError(
        "The `face_recognition` library is not available. Either install it (and dlib) or rely on the OpenCV fallback."
    )


def get_face_encoding_from_image(image_file) -> List[float]:
    """Return the first face encoding found in the uploaded image file as a list of floats.

    If `face_recognition` is not available, raises RuntimeError. This function is used
    to compute and store an encoding when the high-quality method is available.
    """
    if face_recognition is None:
        _raise_face_recognition_missing()

    # Read bytes and pass a BytesIO to face_recognition
    image_bytes = image_file.read()
    try:
        image_file.seek(0)
    except Exception:
        pass

    image = face_recognition.load_image_file(io.BytesIO(image_bytes))
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        raise ValueError('No face found in the provided image.')
    return encodings[0].tolist()


def _detect_and_crop_face_cv2(image_path_or_bytes) -> Optional[_np.ndarray]:
    """Detect the first face with OpenCV Haarcascade and return the cropped grayscale face as numpy array.



    Accepts either a filesystem path (str/Path) or bytes-like object.
    Returns None if no face is found or if OpenCV is not available.
    """
    if cv2 is None or _np is None:
        return None

    # Load image
    if isinstance(image_path_or_bytes, (bytes, bytearray)):
        arr = _np.frombuffer(image_path_or_bytes, _np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    else:
        # assume path-like or file-like with .read()
        try:
            img = cv2.imread(str(image_path_or_bytes))
        except Exception:
            # try reading file-like
            try:
                data = image_path_or_bytes.read()
                arr = _np.frombuffer(data, _np.uint8)
                img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
            except Exception:
                return None

    if img is None:
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    detector = cv2.CascadeClassifier(cascade_path)
    faces = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    if len(faces) == 0:
        return None

    x, y, w, h = faces[0]
    face_crop = gray[y:y+h, x:x+w]
    face_resized = cv2.resize(face_crop, (200, 200))
    return face_resized


def process_webcam_frame(image_data):
    """
    Process a frame from webcam for face detection and encoding
    """
    if face_recognition is None:
        _raise_face_recognition_missing()

    if cv2 is None or _np is None:
        raise RuntimeError("OpenCV is required for webcam processing")

    # Convert bytes to numpy array
    nparr = _np.frombuffer(image_data, _np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return None, "Failed to decode image"

    # Convert BGR to RGB (face_recognition uses RGB)
    rgb_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Detect faces in the image
    face_locations = face_recognition.face_locations(rgb_image)

    if not face_locations:
        return None, "No face detected in the frame"

    if len(face_locations) > 1:
        return None, "Multiple faces detected. Please ensure only one face is in frame"

    # Get face encodings
    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

    if not face_encodings:
        return None, "Could not encode face features"

    # Convert the numpy array to a list for JSON serialization
    face_encoding = face_encodings[0].tolist()

    return face_encoding, None

def verify_face_against_encoding(stored_encoding, image_file, tolerance: float = 0.6) -> bool:
    """Verify a candidate image against stored data.

    - If stored_encoding is provided (list), use `face_recognition` to compare.
    - Otherwise, if OpenCV is available and `image_file` and stored image bytes/path
      are available in the caller (the caller can pass user.face_image.path as stored_encoding),
      this function will attempt a simple image-based comparison using OpenCV.

    Note: For OpenCV fallback the `stored_encoding` parameter should be the path to the stored image
    (string) or bytes of the stored image. The `image_file` parameter may be a file-like object.
    """
    # Primary path: face_recognition
    if stored_encoding and face_recognition is not None:
        try:
            candidate_encoding = get_face_encoding_from_image(image_file)
        except Exception:
            raise

        import numpy as _np_local
        distances = face_recognition.face_distance([_np_local.array(stored_encoding)], _np_local.array(candidate_encoding))
        if len(distances) == 0:
            return False
        return float(distances[0]) <= float(tolerance)

    # Fallback: OpenCV-based comparison using stored image path or bytes
    if cv2 is None or _np is None:
        raise RuntimeError('No face verification backend is available (need face_recognition or opencv).')

    # Obtain stored image bytes/path
    stored = stored_encoding

    # Prepare stored face crop
    stored_crop = None
    try:
        if hasattr(stored, 'read'):
            stored_bytes = stored.read()
            try:
                stored_crop = _detect_and_crop_face_cv2(stored_bytes)
            finally:
                try:
                    stored.seek(0)
                except Exception:
                    pass
        else:
            # treat as path
            stored_crop = _detect_and_crop_face_cv2(stored)
    except Exception:
        stored_crop = None

    # Candidate crop
    candidate_bytes = None
    try:
        candidate_bytes = image_file.read()
        try:
            image_file.seek(0)
        except Exception:
            pass
    except Exception:
        candidate_bytes = None

    candidate_crop = _detect_and_crop_face_cv2(candidate_bytes)

    if stored_crop is None or candidate_crop is None:
        return False

    # Compare using normalized cosine similarity on flattened arrays
    a = stored_crop.flatten().astype(_np.float32)
    b = candidate_crop.flatten().astype(_np.float32)
    # normalize
    a /= (_np.linalg.norm(a) + 1e-8)
    b /= (_np.linalg.norm(b) + 1e-8)
    cos_sim = float(_np.dot(a, b))
    # cosine similarity is in [-1,1], similar faces -> closer to 1
    return cos_sim >= 0.7