import { useState } from 'react';
import PropTypes from 'prop-types';
import { login, register } from '../services/authService';
import '../styles/AuthPage.css';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fn = mode === 'login' ? login : register;
      const user = await fn(email.toLowerCase().trim(), password);
      onAuth(user.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__brand">EventHub</h1>
        <p className="auth-page__tagline">Discover your city's pulse.</p>

        <div className="auth-page__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-page__tab ${mode === 'login' ? 'auth-page__tab--active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={mode === 'register'}
            className={`auth-page__tab ${mode === 'register' ? 'auth-page__tab--active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <form
          className="auth-page__form"
          onSubmit={handleSubmit}
          aria-label={mode === 'login' ? 'Sign in form' : 'Register form'}
        >
          <div className="auth-page__field">
            <label htmlFor="auth-email" className="auth-page__label">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              className="auth-page__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="auth-page__field">
            <label htmlFor="auth-password" className="auth-page__label">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="auth-page__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'At least 6 characters' : 'Password'}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <p className="auth-page__error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-page__btn" type="submit" disabled={loading}>
            {loading ? '…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
}

AuthPage.propTypes = {
  onAuth: PropTypes.func.isRequired,
};
