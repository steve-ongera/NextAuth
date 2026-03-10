import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, authAPI, getUser, setUser, removeToken, removeUser } from '../services/api';

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

const today = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUserState] = useState(getUser());
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '', bio: '' });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* Fetch fresh profile on mount */
  useEffect(() => {
    userAPI.getProfile()
      .then((data) => { setUserState(data); setUser(data); })
      .catch(() => {});
  }, []);

  /* Sync edit form when user updates */
  useEffect(() => {
    if (user) {
      setEditForm({ username: user.username, email: user.email, bio: user.bio || '' });
    }
  }, [user]);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await authAPI.logout(); } catch (_) {}
    removeToken();
    removeUser();
    navigate('/login');
  };

  const handleEditChange = (e) =>
    setEditForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
    if (newImage) fd.append('profile_image', newImage);
    try {
      const data = await userAPI.updateProfile(fd);
      setUserState(data.user);
      setUser(data.user);
      setEditMode(false);
      setNewImage(null);
      setImagePreview(null);
      showAlert('success', 'Profile updated successfully!');
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = imagePreview || user?.profile_image || null;

  return (
    <>
      <div className="bg-mesh" />
      <div className="dashboard-layout">

        {/* ── Topbar ─────────────────────────────── */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="brand-icon" style={{ width: 30, height: 30, fontSize: '0.9rem' }}>
              <i className="bi bi-shield-lock-fill" />
            </div>
            <span className="brand-name" style={{ fontSize: '1.1rem' }}>Nex<span>Auth</span></span>
          </div>

          <div className="topbar-right">
            <span className="topbar-username">@{user?.username}</span>
            <div className="topbar-avatar">
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" />
                : <i className="bi bi-person-fill" />
              }
            </div>
            <button className="btn-danger" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut
                ? <span className="spinner" style={{ borderTopColor: 'var(--danger)' }} />
                : <i className="bi bi-box-arrow-right" />
              }
              {loggingOut ? '' : 'Logout'}
            </button>
          </div>
        </header>

        {/* ── Main content ───────────────────────── */}
        <main className="dashboard-content">

          {/* Greeting */}
          <div className="dashboard-header">
            <h1 className="dashboard-greeting">
              Hello, <span>{user?.username || 'User'}</span> 👋
            </h1>
            <p className="dashboard-date">{today()}</p>
          </div>

          {/* Alert */}
          {alert.msg && (
            <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
              <i className={`bi ${alert.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}`} />
              {alert.msg}
            </div>
          )}

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><i className="bi bi-calendar-check" /></div>
              <div className="stat-value">{formatDate(user?.date_joined).split(' ')[2]}</div>
              <div className="stat-label">Member since</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="bi bi-person-badge" /></div>
              <div className="stat-value">Active</div>
              <div className="stat-label">Account status</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="bi bi-shield-check" /></div>
              <div className="stat-value">Secure</div>
              <div className="stat-label">Session</div>
            </div>
          </div>

          {/* Profile card */}
          <div className="profile-card">

            <div className="profile-card-header">
              {/* Avatar */}
              <div className="profile-avatar-lg">
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" />
                  : <i className="bi bi-person-fill" />
                }
              </div>

              <div className="profile-meta">
                <div className="profile-name">{user?.username}</div>
                <div className="profile-email">
                  <i className="bi bi-envelope" />
                  {user?.email}
                </div>
                <div className="profile-badge">
                  <i className="bi bi-patch-check-fill" /> Verified
                </div>
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="form-label" style={{ marginBottom: '0.4rem' }}>About</div>
              <div className="profile-bio">
                {user?.bio
                  ? user.bio
                  : <span className="profile-bio-empty">No bio added yet.</span>
                }
              </div>
            </div>

            {/* Info grid */}
            <div className="info-grid">
              <div className="info-item">
                <div className="info-item-label"><i className="bi bi-person" /> Username</div>
                <div className="info-item-value">@{user?.username}</div>
              </div>
              <div className="info-item">
                <div className="info-item-label"><i className="bi bi-envelope" /> Email</div>
                <div className="info-item-value">{user?.email}</div>
              </div>
              <div className="info-item">
                <div className="info-item-label"><i className="bi bi-calendar-plus" /> Joined</div>
                <div className="info-item-value">{formatDate(user?.date_joined)}</div>
              </div>
              <div className="info-item">
                <div className="info-item-label"><i className="bi bi-clock-history" /> Last updated</div>
                <div className="info-item-value">{formatDate(user?.updated_at)}</div>
              </div>
            </div>

            {/* Actions */}
            {!editMode && (
              <div className="card-actions">
                <button className="btn-ghost" onClick={() => setEditMode(true)}>
                  <i className="bi bi-pencil-square" /> Edit Profile
                </button>
              </div>
            )}

            {/* Edit form */}
            {editMode && (
              <div className="edit-section">
                <div className="edit-section-title">
                  <i className="bi bi-pencil-square" /> Edit Profile
                </div>

                <form onSubmit={handleSave}>

                  {/* Avatar change */}
                  <div className="form-group">
                    <label className="form-label">Profile Picture</label>
                    <label className="avatar-upload" htmlFor="edit_image">
                      <div className="avatar-preview">
                        {avatarSrc ? <img src={avatarSrc} alt="preview" /> : <i className="bi bi-person" />}
                      </div>
                      <div className="avatar-upload-text">
                        <strong>{newImage ? newImage.name : 'Change photo'}</strong>
                        <small>PNG, JPG up to 5 MB</small>
                      </div>
                      <i className="bi bi-upload" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                      <input id="edit_image" type="file" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <div className="input-wrapper">
                      <input className="form-input" name="username" type="text"
                        value={editForm.username} onChange={handleEditChange} required />
                      <i className="bi bi-person input-icon" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <div className="input-wrapper">
                      <input className="form-input" name="email" type="email"
                        value={editForm.email} onChange={handleEditChange} required />
                      <i className="bi bi-envelope input-icon" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <div className="input-wrapper">
                      <textarea className="form-input" name="bio"
                        placeholder="Tell us about yourself…"
                        value={editForm.bio} onChange={handleEditChange}
                        style={{ paddingLeft: '2.6rem' }} />
                      <i className="bi bi-chat-quote input-icon" style={{ top: '1rem', transform: 'none' }} />
                    </div>
                  </div>

                  <div className="card-actions">
                    <button type="submit" className="btn-primary"
                      style={{ width: 'auto', padding: '0.7rem 1.5rem' }} disabled={saving}>
                      {saving ? <><span className="spinner" /> Saving…</> : <><i className="bi bi-check-lg" /> Save Changes</>}
                    </button>
                    <button type="button" className="btn-ghost"
                      onClick={() => { setEditMode(false); setNewImage(null); setImagePreview(null); }}>
                      <i className="bi bi-x-lg" /> Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>{/* /profile-card */}
        </main>
      </div>
    </>
  );
}