import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setToken, setUser } from '../services/api';

const DEFAULT_AVATAR = null;

export default function Register() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    bio: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_AVATAR);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (profileImage) fd.append('profile_image', profileImage);

    setLoading(true);
    try {
      const data = await authAPI.register(fd);
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-mesh" />
      <div className="auth-layout">
        <div className="auth-card" style={{ maxWidth: 500 }}>

          {/* Brand */}
          <div className="brand">
            <div className="brand-icon">
              <i className="bi bi-shield-lock-fill" />
            </div>
            <span className="brand-name">Nex<span>Auth</span></span>
          </div>

          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join NexAuth in seconds</p>

          {error && (
            <div className="alert alert-error">
              <i className="bi bi-exclamation-circle" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Avatar upload */}
            <div className="form-group">
              <label className="form-label">Profile Picture</label>
              <label className="avatar-upload" htmlFor="profile_image">
                <div className="avatar-preview">
                  {preview
                    ? <img src={preview} alt="preview" />
                    : <i className="bi bi-person" />
                  }
                </div>
                <div className="avatar-upload-text">
                  <strong>{profileImage ? profileImage.name : 'Upload a photo'}</strong>
                  <small>PNG, JPG up to 5 MB</small>
                </div>
                <i className="bi bi-upload" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                <input
                  id="profile_image"
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleFile}
                />
              </label>
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input id="username" className="form-input" name="username"
                  type="text" placeholder="yourname"
                  value={form.username} onChange={handleChange} required />
                <i className="bi bi-person input-icon" />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input id="email" className="form-input" name="email"
                  type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required />
                <i className="bi bi-envelope input-icon" />
              </div>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label" htmlFor="bio">Bio <span style={{ color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <div className="input-wrapper">
                <textarea id="bio" className="form-input" name="bio"
                  placeholder="Tell us something about yourself…"
                  value={form.bio} onChange={handleChange}
                  style={{ paddingLeft: '2.6rem' }} />
                <i className="bi bi-chat-quote input-icon" style={{ top: '1rem', transform: 'none' }} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input id="password" className="form-input" name="password"
                  type="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required />
                <i className="bi bi-lock input-icon" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password2">Confirm Password</label>
              <div className="input-wrapper">
                <input id="password2" className="form-input" name="password2"
                  type="password" placeholder="Repeat your password"
                  value={form.password2} onChange={handleChange} required />
                <i className="bi bi-lock-fill input-icon" />
              </div>
            </div>

            <button type="submit" className="btn-primary"
              style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading
                ? <><span className="spinner" /> Creating account…</>
                : <><i className="bi bi-person-check" /> Create Account</>
              }
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}