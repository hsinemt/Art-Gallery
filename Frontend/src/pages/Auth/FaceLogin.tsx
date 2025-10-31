import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamCapture from './WebcamCapture';
import { useAuth } from '../../context/AuthContext';
import { loginUser, loginUserWithFace } from '../../api/auth/auth';

type FaceLoginProps = {
    inModal?: boolean;
    onComplete?: () => void;
};

const FaceLogin: React.FC<FaceLoginProps> = ({ inModal = false, onComplete }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<'credentials' | 'face'>('credentials');
    const [faceImage, setFaceImage] = useState<Blob | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { refreshUser } = useAuth();

    // Reset component state when it mounts
    useEffect(() => {
        // Reset all states when component mounts
        setUsername('');
        setPassword('');
        setError('');
        setStep('credentials');
        setFaceImage(null);
        setIsLoggingIn(false);

        // Cleanup on unmount
        return () => {
            const videoElements = document.querySelectorAll('video');
            videoElements.forEach((video) => {
                if (video.srcObject) {
                    const stream = video.srcObject as MediaStream;
                    stream.getTracks().forEach((track) => track.stop());
                    video.srcObject = null;
                }
            });
        };
    }, []);

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            const response = await loginUser({ username, password });

            if (response.face_required) {
                setStep('face');
            } else if (response.token) {
                await refreshUser();
                if (inModal && onComplete) {
                    onComplete();
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Invalid credentials';
            setError(errorMessage);
        }
    };

    const handleFaceCapture = (blob: Blob) => {
        setFaceImage(blob);
        setError('');
    };

    const stopAllCameras = () => {
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoElement.srcObject = null;
        }
    };

    const handleFaceLogin = async () => {
        if (!faceImage) {
            setError('Please capture your face first');
            return;
        }

        if (isLoggingIn) return;

        setIsLoggingIn(true);
        setError('');

        try {
            await loginUserWithFace(username, password, faceImage);

            stopAllCameras();
            await refreshUser();
            await new Promise((resolve) => setTimeout(resolve, 100));

            if (inModal && onComplete) {
                onComplete();
            } else {
                navigate('/');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Face verification failed';
            setError(errorMessage);
            setFaceImage(null);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleBack = () => {
        stopAllCameras();
        setStep('credentials');
        setFaceImage(null);
        setError('');
    };

    const handleRetry = () => {
        setError('');
        setFaceImage(null);
    };

    return (
        <div className="face-login-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                {step === 'credentials' ? 'Login' : 'Face Verification'}
            </h2>

            {error && (
                <div style={{
                    backgroundColor: '#ffe6e6',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    color: '#721c24'
                }}>
                    {error}
                </div>
            )}

            {step === 'credentials' ? (
                <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Continue
                    </button>
                </form>
            ) : (
                <div>
                    <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                        Please capture your face to complete login
                    </p>

                    <WebcamCapture
                        onCapture={handleFaceCapture}
                        key={faceImage ? 'captured' : 'capturing'}
                        stopOnCapture={false}
                    />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                            onClick={handleRetry}
                            disabled={isLoggingIn}
                            style={{
                                backgroundColor: '#6c757d',
                                color: 'white',
                                padding: '10px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                                width: '50%',
                                opacity: isLoggingIn ? 0.6 : 1
                            }}
                        >
                            Retry
                        </button>
                        <button
                            onClick={handleFaceLogin}
                            disabled={!faceImage || isLoggingIn}
                            style={{
                                backgroundColor: faceImage && !isLoggingIn ? '#28a745' : '#cccccc',
                                color: 'white',
                                padding: '10px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: faceImage && !isLoggingIn ? 'pointer' : 'not-allowed',
                                width: '50%'
                            }}
                        >
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </button>
                    </div>

                    <button
                        onClick={handleBack}
                        disabled={isLoggingIn}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                            width: '100%',
                            marginTop: '10px',
                            opacity: isLoggingIn ? 0.6 : 1
                        }}
                    >
                        Back to Credentials
                    </button>
                </div>
            )}
        </div>
    );
};

export default FaceLogin;