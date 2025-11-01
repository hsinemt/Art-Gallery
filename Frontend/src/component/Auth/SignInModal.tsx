import { type FormEvent, useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';

const SignInModal = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Static credentials
  const STATIC_USERNAME = 'hsinemt';
  const STATIC_PASSWORD = 'hsine123';

  const closeModal = () => {
    // @ts-ignore
    if (window && (window as any).$) {
      const $ = (window as any).$;
      if ($) {
        $('#signinModal').modal('hide');
        // Remove modal backdrop
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
      }
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate a short delay for better UX
    setTimeout(() => {
      // Check static credentials
      if (username === STATIC_USERNAME && password === STATIC_PASSWORD) {
        // Success - store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        setUsername('');
        setPassword('');
        setLoading(false);
        closeModal();
        
        // Navigate to home after modal is closed
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Refresh to update auth state
        }, 300);
      } else {
        setError('Invalid username or password. Try: admin / admin123');
        setLoading(false);
      }
    }, 500);
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
            <h4 className="modal-title" id="signinModalLabel">SIGN IN</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            
            {/* Demo credentials info */}
            <div className="alert alert-info" role="alert" style={{ fontSize: '0.9rem' }}>
              <strong>Demo Credentials:</strong><br />
              Username: <code>admin</code><br />
              Password: <code>admin123</code>
            </div>

            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="signin-username">USERNAME</label>
                <input
                  type="text"
                  className="form-control"
                  id="signin-username"
                  name="username"
                  placeholder="hsinemt"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  data-interaction-state="observed"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signin-password">PASSWORD</label>
                <input
                  type="password"
                  className="form-control"
                  id="signin-password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  data-interaction-state="observed"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={loading}
                style={{ backgroundColor: '#8b7355', borderColor: '#8b7355' }}
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
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
              style={{ color: '#8b7355' }}
            >
              CREATE AN ACCOUNT
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
