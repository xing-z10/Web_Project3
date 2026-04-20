import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/EmailPrompt.css';

function EmailPrompt({ onEmailSubmit }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const validate = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate(input)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onEmailSubmit(input.toLowerCase().trim());
  };

  return (
    <main className="email-prompt">
      <div className="email-prompt__card">
        <h1 className="email-prompt__title">Welcome to EventHub</h1>
        <p className="email-prompt__desc">
          Enter your email to save favorites and preferences across sessions. No account required.
        </p>
        <form className="email-prompt__form" onSubmit={handleSubmit} aria-label="Email sign in">
          <label htmlFor="email-input" className="sr-only">Email address</label>
          <input
            id="email-input"
            className="email-prompt__input"
            type="email"
            placeholder="you@example.com"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-describedby={error ? 'email-error' : undefined}
            autoFocus
          />
          {error && (
            <p id="email-error" className="email-prompt__error" role="alert">
              {error}
            </p>
          )}
          <button className="email-prompt__btn" type="submit">
            Get Started
          </button>
        </form>
        <p className="email-prompt__note">
          Your email is only used as a local identifier — no passwords, no spam.
        </p>
      </div>
    </main>
  );
}

EmailPrompt.propTypes = {
  onEmailSubmit: PropTypes.func.isRequired,
};

export default EmailPrompt;