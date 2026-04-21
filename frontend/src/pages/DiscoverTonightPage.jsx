import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTodayEvents } from '../services/eventService';
import { getPreference } from '../services/preferenceService';
import EventCard from '../components/events/EventCard';
import '../styles/DiscoverTonightPage.css';

function normalizeEvent(event) {
  return {
    ...event,
    isFree: event.price === 0,
    sourceUrl: event.source,
    sourcePlatform: event.source_platform || '',
    location: {
      address: event.location_venue || '',
      city: event.location_city || '',
    },
  };
}

function getTodayRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  return { dateFrom: start.toISOString(), dateTo: end.toISOString() };
}

export default function DiscoverTonightPage({ email }) {
  const [preference, setPreference] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      let pref = null;
      try {
        const data = await getPreference(email);
        if (data) {
          setPreference(data);
          pref = data;
        }
      } catch (err) {
        console.error('Failed to load preference:', err.message);
      }
      await fetchEvents(pref);
    }
    if (email) init();
  }, [email]);

  async function fetchEvents(pref) {
    setLoading(true);
    setError(null);
    try {
      const params = { ...getTodayRange() };
      if (pref?.last_city) params.city = pref.last_city;
      if (pref?.preferred_cate) params.category = pref.preferred_cate;

      const results = await getTodayEvents(params);
      if (!results || results.length === 0) {
        setError('No events found for today.');
      } else {
        setEvents(results.map(normalizeEvent));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTryAnother() {
    await fetchEvents(preference);
  }

  return (
    <main className="discover-tonight-page">
      <section className="discover-hero" aria-label="Page header">
        <div className="discover-hero__text">
          <h1 className="discover-hero__heading">
            Discover <em className="discover-hero__accent">tonight.</em>
          </h1>
          <p className="discover-hero__sub">
            {preference?.last_city
              ? `Events happening today in ${preference.last_city}.`
              : 'Events happening today, curated for you.'}
          </p>
        </div>
      </section>

      {loading && (
        <p className="discover-tonight-page__placeholder" aria-live="polite">
          Finding events for you...
        </p>
      )}

      {!loading && error && (
        <p className="discover-tonight-page__error" role="alert">
          {error}
        </p>
      )}

      {!loading && events.length > 0 && (
        <section aria-label="Today's events">
          <ol className="discover-tonight-page__grid">
            {events.map((event) => (
              <li key={event._id}>
                <EventCard event={event} />
              </li>
            ))}
          </ol>
          <div className="discover-tonight-page__refresh">
            <button
              className="discover-tonight-page__btn discover-tonight-page__btn--secondary"
              onClick={handleTryAnother}
              disabled={loading}
            >
              Try Another
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

DiscoverTonightPage.propTypes = {
  email: PropTypes.string.isRequired,
};
