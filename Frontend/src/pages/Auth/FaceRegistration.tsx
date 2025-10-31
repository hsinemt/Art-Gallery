import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamCapture from './WebcamCapture';
import { registerUser, uploadFaceImage } from '../../api/auth/auth';
import { useAuth } from '../../context/AuthContext';

interface RegistrationData {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    user_type: 'user' | 'artist';
}

type FaceRegistrationProps = {
    inModal?: boolean;
    onComplete?: () => void;
};

const FaceRegistration: React.FC<FaceRegistrationProps> = ({ inModal = false, onComplete }) => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState<RegistrationData>({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        user_type: 'user'
    });
    const [faceImage, setFaceImage] = useState<Blob | null>(null);
    const [error, setError] = useState<string>('');
    const [step, setStep] = useState<'form' | 'face'>('form');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegistration = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.email || !formData.password || !formData.password2 ||
            !formData.first_name || !formData.last_name) {
            setError('All fields are required');
            return;
        }

        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await registerUser(formData);

            if (response.token) {
                setStep('face');
            } else {
                setError('Registration failed: No token received');
            }
        } catch (err: any) {
            if (err.response?.data) {
                const errorData = err.response.data;
                let errorMessage = '';

                Object.keys(errorData).forEach(key => {
                    if (Array.isArray(errorData[key])) {
                        errorMessage += `${key}: ${errorData[key].join(', ')}\n`;
                    } else if (typeof errorData[key] === 'string') {
                        errorMessage += `${errorData[key]}\n`;
                    }
                });

                setError(errorMessage.trim() || 'Registration failed');
            } else {
                setError('Registration failed. Please try again.');
            }
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

    const handleFaceUpload = async () => {
        if (!faceImage) {
            setError('Please capture your face first');
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);
        setError('');

        try {
            await uploadFaceImage(faceImage);

            stopAllCameras();
            await refreshUser();
            await new Promise((resolve) => setTimeout(resolve, 100));

            if (inModal && onComplete) {
                onComplete();
            } else {
                navigate('/login');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error ||
                err.response?.data?.message ||
                'Face upload failed';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="face-registration-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register with Face Verification</h2>

            {error && (
                <div style={{
                    backgroundColor: '#ffe6e6',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    color: '#721c24',
                    whiteSpace: 'pre-line'
                }}>
                    {error}
                </div>
            )}

            {step === 'form' ? (
                <form onSubmit={handleRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Username: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Enter username"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Email: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            First Name: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Enter first name"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Last Name: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Enter last name"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Password: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Enter password (min 8 characters)"
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Confirm Password: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            placeholder="Confirm password"
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            User Type: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select
                            name="user_type"
                            value={formData.user_type}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="user">I Am User</option>
                            <option value="artist">I Am Artist</option>
                        </select>
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
                            marginTop: '10px',
                            fontSize: '16px'
                        }}
                    >
                        Next: Face Registration
                    </button>
                </form>
            ) : (
                <div>
                    <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                        Please capture your face to complete registration
                    </p>

                    <WebcamCapture
                        onCapture={handleFaceCapture}
                        stopOnCapture={false}
                    />

                    <button
                        onClick={handleFaceUpload}
                        disabled={!faceImage || isSubmitting}
                        style={{
                            backgroundColor: faceImage && !isSubmitting ? '#28a745' : '#cccccc',
                            color: 'white',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: faceImage && !isSubmitting ? 'pointer' : 'not-allowed',
                            width: '100%',
                            marginTop: '20px',
                            fontSize: '16px'
                        }}
                    >
                        {isSubmitting ? 'Completing Registration...' : 'Complete Registration'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FaceRegistration;