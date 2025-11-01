import { type FormEvent, useState } from 'react';
import './auth.css';
import { useAuth } from '../../context/AuthContext';

const SignInModal = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    // @ts-ignore
    if (window && (window as any).$) {
      const $ = (window as any).$;
      if ($) {
        $('#signinModal').modal('hide');
      }
    }
  };

  const extractError = (err: any): string => {
    const data = err?.response?.data;
    return (
      data?.detail ||
      data?.error ||
      (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) ||
      data?.username ||
      data?.password ||
      err?.message ||
      'Login failed'
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login({ username, password });
      setUsername('');
      setPassword('');
      closeModal();
    } catch (err: any) {
      const msg = extractError(err);
      setError(typeof msg === 'string' ? msg : 'Login failed');
    } finally {
      setLoading(false);
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
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="signin-username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="signin-username"
                  placeholder="your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signin-password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="signin-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
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
