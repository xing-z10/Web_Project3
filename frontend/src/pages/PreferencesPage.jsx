import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPreference, updatePreference, deletePreference } from '../services/preferenceService';
import '../styles/PreferencesPage.css';

const CATEGORIES = [
  'Art Exhibitions', 'Board Games', 'Comic Concerts', 'Concerts',
  'Livehouses', 'Movie Premieres', 'Parties', 'Theaters',
];

export default function PreferencesPage({ email }) {
  const [pref, setPref] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [preferredCate, setPreferredCate] = useState('');
  const [excludeCate, setExcludeCate] = useState('');
  const [lastCity, setLastCity] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getPreference(email);
        if (data) {
          setPref(data);
          setPreferredCate(data.preferred_cate || '');
          setExcludeCate(data.exclude_cate || '');
          setLastCity(data.last_city || '');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [email]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updatePreference(email, {
        preferred_cate: preferredCate,
        exclude_cate: excludeCate,
        last_city: lastCity,
      });
      setPref(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete your preferences?')) return;
    try {
      await deletePreference(email);
      setPref(null);
      setPreferredCate('');
      setExcludeCate('');
      setLastCity('');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="preferences-page">
        <p className="preferences-page__loading">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="preferences-page">
      <section className="discover-hero">
        <div className="discover-hero__text">
          <h1 className="discover-hero__heading">
            Your <em className="discover-hero__accent">preferences.</em>
          </h1>
          <p className="discover-hero__sub">
            Customize your event feed, favorite categories, and city.
          </p>
        </div>
      </section>

      <div className="preferences-page__content">
        <div className="preferences-page__card">
          <div className="preferences-page__email-row">
            <span className="preferences-page__email-label">Signed in as</span>
            <span className="preferences-page__email">{email}</span>
          </div>

          {error && <div className="preferences-page__alert">{error}</div>}
          {saved && <div className="preferences-page__success">Preferences saved!</div>}

          <form onSubmit={handleSave}>
            <div className="preferences-page__section-label">Your City</div>
            <div className="preferences-page__field">
              <label>Default city for event discovery</label>
              <input
                type="text"
                value={lastCity}
                onChange={(e) => setLastCity(e.target.value)}
                placeholder="e.g. New York"
              />
            </div>

            <div className="preferences-page__section-label">Preferred Category</div>
            <div className="preferences-page__field">
              <label>Used by Discover Tonight to suggest events</label>
              <select
                value={preferredCate}
                onChange={(e) => setPreferredCate(e.target.value)}
              >
                <option value="">None</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="preferences-page__section-label">Excluded Category</div>
            <div className="preferences-page__field">
              <label>Hide this category from your feed</label>
              <select
                value={excludeCate}
                onChange={(e) => setExcludeCate(e.target.value)}
              >
                <option value="">None</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="preferences-page__actions">
              <button
                type="button"
                className="preferences-page__delete-btn"
                onClick={handleDelete}
              >
                Delete Preferences
              </button>
              <button
                type="submit"
                className="preferences-page__save-btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

PreferencesPage.propTypes = {
  email: PropTypes.string.isRequired,
};