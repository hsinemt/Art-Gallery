import { FormEvent } from 'react';
import './auth.css';

const SignInModal = () => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: integrate with API
    // For now, just close the modal via Bootstrap data API if present
    // @ts-ignore
    if (window && (window as any).$) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="signin-email">Email</label>
                <input type="email" className="form-control" id="signin-email" placeholder="name@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="signin-password">Password</label>
                <input type="password" className="form-control" id="signin-password" placeholder="••••••••" required />
              </div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" id="signin-remember" /> Remember me
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Sign In</button>
            </form>
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
