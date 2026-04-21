import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  getPreference,
  updatePreference,
  deletePreference,
  createPreference,
} from '../services/preferenceService';
import { getEventByNumericId } from '../services/eventService';
import EventCard from '../components/events/EventCard';
import '../styles/PreferencesPage.css';

const CATEGORIES = [
  'Art Exhibitions', 'Board Games', 'Comic Concerts', 'Concerts',
  'Livehouses', 'Movie Premieres', 'Parties', 'Theaters',
];

export default function PreferencesPage({ email, onEmailChange }) {
  const [pref, setPref] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [preferredCate, setPreferredCate] = useState('');
  const [excludeCate, setExcludeCate] = useState('');
  const [lastCity, setLastCity] = useState('');
  const [comparisonEvents, setComparisonEvents] = useState([]);
  const comparisonsRef = useRef(null);
  const location = useLocation();

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

  useEffect(() => {
    async function loadComparisons() {
      const ids = [pref?.comparison_1, pref?.comparison_2, pref?.comparison_3].filter(Boolean);
      if (ids.length === 0) { setComparisonEvents([]); return; }
      try {
        const results = await Promise.all(ids.map((id) => getEventByNumericId(id)));
        setComparisonEvents(results.filter(Boolean));
      } catch (err) {
        console.error('Failed to load comparison events:', err.message);
      }
    }
    loadComparisons();
  }, [pref]);

  useEffect(() => {
    if (location.hash === '#comparisons' && comparisonsRef.current) {
      comparisonsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comparisonEvents, location.hash]);

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
      setComparisonEvents([]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemoveComparison(eventNumericId) {
    const fields = ['comparison_1', 'comparison_2', 'comparison_3'];
    const update = {};
    fields.forEach((f) => {
      if (pref[f] === eventNumericId) update[f] = null;
    });
    try {
      const updated = await updatePreference(email, update);
      setPref(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEmailSave() {
    const trimmed = newEmail.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      let data = await getPreference(trimmed);
      if (!data) {
        data = await createPreference({ email: trimmed });
      }
      setPref(data);
      setPreferredCate(data.preferred_cate || '');
      setExcludeCate(data.exclude_cate || '');
      setLastCity(data.last_city || '');
      setComparisonEvents([]);
      localStorage.setItem('eventhub_email', trimmed);
      onEmailChange(trimmed);
      setEditingEmail(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <main className="preferences-page">
        <p className="preferences-page__loading">Loading your preferences...</p>
      </main>
    );
  }

  return (
    <main className="preferences-page">
      <section className="discover-hero" aria-label="Page header">
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
            {editingEmail ? (
              <div className="preferences-page__email-edit" role="group" aria-label="Change email">
                <label htmlFor="new-email" className="sr-only">New email address</label>
                <input
                  id="new-email"
                  className="preferences-page__email-input"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@example.com"
                />
                <button type="button" className="preferences-page__email-save" onClick={handleEmailSave}>Save</button>
                <button type="button" className="preferences-page__email-cancel" onClick={() => setEditingEmail(false)}>Cancel</button>
              </div>
            ) : (
              <div className="preferences-page__email-display">
                <span className="preferences-page__email">{email}</span>
                <button
                  type="button"
                  className="preferences-page__email-change"
                  onClick={() => { setNewEmail(email); setEditingEmail(true); }}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {error && <p className="preferences-page__alert" role="alert">{error}</p>}
          {saved && <p className="preferences-page__success" aria-live="polite">Preferences saved!</p>}

          <form onSubmit={handleSave} aria-label="Preferences form">
            <fieldset className="preferences-page__fieldset">
              <legend className="preferences-page__section-label">Your City</legend>
              <div className="preferences-page__field">
                <label htmlFor="last-city">Default city for event discovery</label>
                <input
                  id="last-city"
                  type="text"
                  value={lastCity}
                  onChange={(e) => setLastCity(e.target.value)}
                  placeholder="e.g. New York"
                />
              </div>
            </fieldset>

            <fieldset className="preferences-page__fieldset">
              <legend className="preferences-page__section-label">Preferred Category</legend>
              <div className="preferences-page__field">
                <label htmlFor="preferred-cate">Used by Discover Tonight to suggest events</label>
                <select id="preferred-cate" value={preferredCate} onChange={(e) => setPreferredCate(e.target.value)}>
                  <option value="">None</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </fieldset>

            <fieldset className="preferences-page__fieldset">
              <legend className="preferences-page__section-label">Excluded Category</legend>
              <div className="preferences-page__field">
                <label htmlFor="exclude-cate">Hide this category from your feed</label>
                <select id="exclude-cate" value={excludeCate} onChange={(e) => setExcludeCate(e.target.value)}>
                  <option value="">None</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </fieldset>

            <div className="preferences-page__actions">
              <button type="button" className="preferences-page__delete-btn" onClick={handleDelete}>
                Delete Preferences
              </button>
              <button type="submit" className="preferences-page__save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {comparisonEvents.length > 0 && (
        <section id="comparisons" ref={comparisonsRef} className="preferences-page__favorites" aria-label="Saved comparisons">
          <h2 className="preferences-page__favorites-title">Saved Comparisons</h2>
          <ul className="preferences-page__favorites-grid">
            {comparisonEvents.map((event) => (
              <li key={event._id} className="preferences-page__comparison-item">
                <EventCard event={event} />
                <button
                  type="button"
                  className="preferences-page__remove-btn"
                  onClick={() => handleRemoveComparison(event.id)}
                  aria-label={`Remove ${event.title} from saved comparisons`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

PreferencesPage.propTypes = {
  email: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
};