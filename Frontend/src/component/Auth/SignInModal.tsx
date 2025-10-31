import { useState, useEffect } from 'react';
import './auth.css';
import FaceLogin from '../../pages/Auth/FaceLogin';

const SignInModal = () => {
    const [error, setError] = useState<string | null>(null);
    const [key, setKey] = useState(0); // Used to force remount of FaceLogin

    useEffect(() => {
        const modalElement = document.getElementById('signinModal');

        const handleModalShow = () => {
            setKey(prev => prev + 1); // Force remount FaceLogin when modal opens
            setError(null);
        };

        if (modalElement) {
            // @ts-ignore
            $(modalElement).on('show.bs.modal', handleModalShow);
        }

        return () => {
            if (modalElement) {
                // @ts-ignore
                $(modalElement).off('show.bs.modal', handleModalShow);
            }
        };
    }, []);

    const closeModal = () => {
        // @ts-ignore
        if (window && (window as any).$) {
            const $ = (window as any).$;
            if ($) {
                $('#signinModal').modal('hide');
            }
        }
    };

    return (
        <div
            className="modal fade auth-modal"
            id="signinModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="signinModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="signinModalLabel">Sign In</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        <FaceLogin key={key} inModal onComplete={closeModal} />
                    </div>

                    <div className="modal-footer auth-alt">
                        <span>New here?</span>
                        <a
                            href="#register"
                            data-toggle="modal"
                            data-target="#registerModal"
                            data-dismiss="modal"
                            className="btn btn-link"
                        >
                            Create an account
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;