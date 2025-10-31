import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const FaceAuth = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: "user"
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            setMessage('Error accessing webcam. Please make sure your camera is connected and you have granted permission.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                // Match canvas size to video size
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                // Draw the current video frame on the canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert the canvas to a blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        sendImageToServer(blob);
                    }
                }, 'image/jpeg');
            }
        }
    };

    const sendImageToServer = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('face_image', blob, 'webcam-capture.jpg');

        try {
            const response = await axios.post(
                'http://localhost:8000/api/users/upload-face/',
                formData,
                {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            setMessage('Face captured and verified successfully!');
        } catch (error) {
            console.error('Error sending face data:', error);
            setMessage('Error verifying face. Please try again.');
        }
    };

    const handleCapture = () => {
        setIsCapturing(true);
        // Take multiple frames for better verification
        const captureInterval = setInterval(() => {
            captureFrame();
        }, 500); // Capture every 500ms

        // Stop capturing after 3 seconds
        setTimeout(() => {
            clearInterval(captureInterval);
            setIsCapturing(false);
        }, 3000);
    };

    return (
        <div className="face-auth-container" style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Face Authentication</h2>
            <div style={{ marginBottom: '20px' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                        width: '640px',
                        height: '480px',
                        border: '2px solid #ccc',
                        borderRadius: '8px'
                    }}
                />
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div>
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
                        cursor: isCapturing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isCapturing ? 'Capturing...' : 'Capture Face'}
                </button>
            </div>
            {message && (
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: message.includes('Error') ? '#ffe6e6' : '#e6ffe6',
                    borderRadius: '4px'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FaceAuth;