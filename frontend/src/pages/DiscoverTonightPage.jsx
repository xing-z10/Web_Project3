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

export default function DiscoverTonightPage({ email }) {
  const [preference, setPreference] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function loadPref() {
      try {
        const data = await getPreference(email);
        if (data) setPreference(data);
      } catch (err) {
        console.error('Failed to load preference:', err.message);
      }
    }
    if (email) loadPref();
  }, [email]);

  async function handleDiscover() {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const params = {};
      if (preference?.last_city) params.city = preference.last_city;
      if (preference?.preferred_cate) params.category = preference.preferred_cate;

      // Get today's date range in UTC
      const now = new Date();
      const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1));
      params.dateFrom = start.toISOString();
      params.dateTo = end.toISOString();

      const results = await getTodayEvents(params);

      if (results.length === 0) {
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

  return (
    <div className="discover-tonight-page">
      <section className="discover-hero">
        <div className="discover-hero__text">
          <h1 className="discover-hero__heading">
            Discover <em className="discover-hero__accent">tonight.</em>
          </h1>
          <p className="discover-hero__sub">
            {preference?.last_city
              ? `Events curated for you in ${preference.last_city}.`
              : 'Events curated just for you, based on your preferences.'}
          </p>
          <button
            className="discover-tonight-page__btn"
            onClick={handleDiscover}
            disabled={loading}
          >
            {loading ? 'Finding events...' : 'Surprise Me'}
          </button>
        </div>
      </section>

      {error && <div className="discover-tonight-page__error">{error}</div>}

      {events.length > 0 && (
        <>
          <div className="discover-tonight-page__grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
          <div className="discover-tonight-page__refresh">
            <button
              className="discover-tonight-page__btn discover-tonight-page__btn--secondary"
              onClick={handleDiscover}
              disabled={loading}
            >
              Try Another 3
            </button>
          </div>
        </>
      )}

      {!searched && !loading && (
        <div className="discover-tonight-page__placeholder">
          <p>Click <strong>Surprise Me</strong> to discover what's happening tonight.</p>
        </div>
      )}
    </div>
  );
}

DiscoverTonightPage.propTypes = {
  email: PropTypes.string.isRequired,
};