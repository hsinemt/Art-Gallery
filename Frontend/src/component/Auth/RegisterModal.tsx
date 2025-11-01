import { type FormEvent, useState } from 'react';
import './auth.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterModal = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    user_type: 'user' as 'user' | 'artist'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    // @ts-ignore
    if (window && (window as any).$) {
      const $ = (window as any).$;
      if ($) {
        $('#registerModal').modal('hide');
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const extractError = (err: any): string => {
    if (err?.message) return err.message;
    const data = err?.response?.data;
    return (
      data?.detail ||
      data?.error ||
      (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) ||
      data?.username ||
      data?.email ||
      data?.password ||
      'Registration failed'
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        user_type: 'user'
      });
      closeModal();
      
      // Navigate to home after successful registration
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 300);
    } catch (err: any) {
      const msg = extractError(err);
      setError(typeof msg === 'string' ? msg : 'Registration failed');
    } finally {
      setLoading(false);
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
            
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="register-username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="register-username"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="register-email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="register-firstname">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="register-firstname"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="register-lastname">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="register-lastname"
                    name="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="register-password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password2">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="register-password2"
                  name="password2"
                  placeholder="••••••••"
                  value={formData.password2}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-usertype">Account Type</label>
                <select
                  className="form-control"
                  id="register-usertype"
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                >
                  <option value="user">Art Lover</option>
                  <option value="artist">Artist</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
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
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
