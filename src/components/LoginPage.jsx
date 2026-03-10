import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Pequeño delay para efecto visual
    await new Promise(r => setTimeout(r, 500));

    const result = login(username.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className={`login-card ${shake ? 'login-shake' : ''}`}>
        {/* Logo + Title */}
        <div className="login-header">
          <div className="login-logo-wrapper">
            <img
              src="/WALTIOS.jpg"
              alt="WATIOS Logo"
              className="login-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                document.getElementById('login-icon-fallback').style.display = 'flex';
              }}
            />
            <div id="login-icon-fallback" className="login-icon-fallback" style={{ display: 'none' }}>
              <Zap className="login-icon-zap" />
            </div>
          </div>
          <h1 className="login-title">WATIOS</h1>
          <p className="login-subtitle">Sistema de Monitoreo Eléctrico</p>
          <p className="login-hint">Ingresa con las credenciales de tu vivienda</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">
              <User size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Usuario
            </label>
            <input
              type="text"
              className="login-input"
              placeholder="ej: casa1"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label className="login-label">
              <Lock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Contraseña
            </label>
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={`login-btn ${loading ? 'login-btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        {/* Houses grid hint */}
        <div className="login-houses">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <div key={n} className="login-house-badge">Casa {n}</div>
          ))}
        </div>

        <p className="login-footer">
          WATIOS v1.0 &nbsp;·&nbsp; Monitoreo en tiempo real
        </p>
      </div>
    </div>
  );
}
