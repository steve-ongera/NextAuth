import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setToken, setUser } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login(form);
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
        <div className="auth-card">

          {/* Brand */}
          <div className="brand">
            <div className="brand-icon">
              <i className="bi bi-shield-lock-fill" />
            </div>
            <span className="brand-name">Nex<span>Auth</span></span>
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          {error && (
            <div className="alert alert-error">
              <i className="bi bi-exclamation-circle" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  className="form-input"
                  name="username"
                  type="text"
                  placeholder="yourname"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
                <i className="bi bi-person input-icon" />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  className="form-input"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-lock input-icon" />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" /> Signing in…</>
                : <><i className="bi bi-arrow-right-circle" /> Sign In</>
              }
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}