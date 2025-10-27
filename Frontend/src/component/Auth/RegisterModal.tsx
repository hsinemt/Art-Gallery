import { FormEvent } from 'react';
import './auth.css';

const RegisterModal = () => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: integrate with API
    // Close modal if Bootstrap/jQuery present
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
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="reg-name">Full Name</label>
                <input type="text" className="form-control" id="reg-name" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input type="email" className="form-control" id="reg-email" placeholder="name@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input type="password" className="form-control" id="reg-password" placeholder="Create a password" required />
              </div>
              <div className="form-group">
                <label htmlFor="reg-password2">Confirm Password</label>
                <input type="password" className="form-control" id="reg-password2" placeholder="Repeat password" required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Create Account</button>
            </form>
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
