import { useState } from 'react';
import logo from '../../assets/logo_asimbv_circle.png';
import { useAdminAuth } from '../contexts';

const LoginPage = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = email.trim() && password;

  const submit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
      setPassword('');
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <img src={logo} alt="ASIMBv" className="adm-login-logo" />
        <h1>Administrare ASIMBv</h1>
        <p>Autentifică-te pentru a gestiona mesajele, evenimentele și partenerii.</p>

        <label className="adm-field">
          <span className="adm-field-label">Email</span>
          <input
            type="email"
            className="adm-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </label>

        <label className="adm-field">
          <span className="adm-field-label">Parolă</span>
          <input
            type="password"
            className="adm-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <div className="adm-alert adm-alert-error">{error}</div>}

        <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={busy || !canSubmit}>
          {busy ? 'Se verifică…' : 'Intră în cont'}
        </button>
        <p className="adm-login-hint">Sesiunea expiră după 12 ore sau la închiderea tab-ului.</p>
      </form>
    </div>
  );
};

export default LoginPage;
