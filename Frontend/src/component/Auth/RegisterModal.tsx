import { type FormEvent, useState } from 'react';
import './auth.css';
import { useAuth } from '../../context/AuthContext';

const RegisterModal = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [userType, setUserType] = useState<'user' | 'artist'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    // Close modal if Bootstrap/jQuery present
    // @ts-ignore
    if (window && (window as any).$) {
      const $ = (window as any).$;
      if ($) {
        $('#registerModal').modal('hide');
      }
    }
  };

  const extractError = (err: any): string => {
    const data = err?.response?.data;
    if (!data) return err?.message || 'Registration failed';
    if (typeof data === 'string') return data;
    // DRF field errors can be objects like {field: ["msg"]}
    const fields = ['username','email','first_name','last_name','password','password2','user_type','non_field_errors','detail','error'];
    for (const f of fields) {
      const v = (data as any)[f];
      if (Array.isArray(v) && v.length) return v[0];
      if (typeof v === 'string') return v;
    }
    return 'Registration failed';
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await register({
        username,
        email,
        password,
        password2: confirm,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
      });
      setUsername('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirm('');
      closeModal();
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
                <label htmlFor="reg-username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="reg-username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-first-name">First name</label>
                <input
                  type="text"
                  className="form-control"
                  id="reg-first-name"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-last-name">Last name</label>
                <input
                  type="text"
                  className="form-control"
                  id="reg-last-name"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="reg-email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-user-type">I am</label>
                <select
                  id="reg-user-type"
                  className="form-control"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as 'user' | 'artist')}
                  required
                >
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="reg-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-password2">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="reg-password2"
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
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
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
