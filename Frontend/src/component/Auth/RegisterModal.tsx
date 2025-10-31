import { useState, useEffect } from 'react';
import './auth.css';
import FaceRegistration from '../../pages/Auth/FaceRegistration';

const RegisterModal = () => {
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Used to force remount of FaceRegistration

  // Reset component when modal is shown
  useEffect(() => {
    const modalElement = document.getElementById('registerModal');

    const handleModalShow = () => {
      setKey(prev => prev + 1); // Force FaceRegistration remount
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
        $('#registerModal').modal('hide');
      }
    }
  };

  return (
      <div
          className="modal fade auth-modal"
          id="registerModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="registerModalLabel"
          aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="registerModalLabel">Create Account</h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <FaceRegistration key={key} inModal onComplete={closeModal} />
            </div>

            <div className="modal-footer auth-alt">
              <span>Already have an account?</span>
              <a
                  href="#signin"
                  data-toggle="modal"
                  data-target="#signinModal"
                  data-dismiss="modal"
                  className="btn btn-link"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RegisterModal;
