import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './styles/style.css';

// Protected route – redirect to /login if no token
const PrivateRoute = ({ children }) =>
  getToken() ? children : <Navigate to="/login" replace />;

// Public-only route – redirect to /dashboard if already authed
const GuestRoute = ({ children }) =>
  !getToken() ? children : <Navigate to="/dashboard" replace />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={<GuestRoute><Login /></GuestRoute>}
        />
        <Route
          path="/register"
          element={<GuestRoute><Register /></GuestRoute>}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}