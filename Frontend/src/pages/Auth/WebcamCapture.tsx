import React, { useRef, useState, useEffect } from 'react';

interface WebcamCaptureProps {
  onCapture: (blob: Blob) => void;
  stopOnCapture?: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, stopOnCapture = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        if (mounted && !capturedImage) {
          const stream = await startCamera();
          if (mounted) {
            streamRef.current = stream;
          } else {
            stream.getTracks().forEach(track => track.stop());
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Camera initialization error:', err);
          setError('Failed to initialize camera');
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [capturedImage]);

  const startCamera = async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Error accessing webcam. Please make sure your camera is connected and you have granted permission.');
      throw err;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image as data URL for preview
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        setShowPreview(true);

        // Convert to blob and send to parent
        canvas.toBlob((blob) => {
          if (blob) {
            onCapture(blob);
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleCapture = () => {
    setIsCapturing(true);

    // Capture a single frame
    setTimeout(() => {
      captureFrame();
      setIsCapturing(false);

      // Stop the camera after capture
      if (stopOnCapture) {
        stopCamera();
      }
    }, 100);
  };

  return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          {/* Video element for live camera */}
          <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                maxWidth: '640px',
                height: 'auto',
                border: '2px solid #ccc',
                borderRadius: '8px',
                display: showPreview ? 'none' : 'block'
              }}
          />

          {/* Preview of captured image */}
          {showPreview && capturedImage && (
              <img
                  src={capturedImage}
                  alt="Captured face"
                  style={{
                    width: '100%',
                    maxWidth: '640px',
                    height: 'auto',
                    border: '2px solid #28a745',
                    borderRadius: '8px',
                    display: 'block'
                  }}
              />
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {error && (
            <div style={{
              color: '#721c24',
              backgroundColor: '#f8d7da',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '10px'
            }}>
              {error}
            </div>
        )}

        {!showPreview && (
            <button
                onClick={handleCapture}
                disabled={isCapturing}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: isCapturing ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isCapturing ? 'not-allowed' : 'pointer',
                  width: '100%',
                  maxWidth: '640px'
                }}
            >
              {isCapturing ? 'Capturing...' : 'Capture Face'}
            </button>
        )}
      </div>
  );
};

export default WebcamCapture;