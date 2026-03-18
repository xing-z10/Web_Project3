import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEvents } from '../hooks/useEvents';
import { getPreference, updatePreference } from '../services/preferenceService';
import { getEventByNumericId } from '../services/eventService';
import FilterBar from '../components/events/FilterBar';
import SearchBar from '../components/events/SearchBar';
import EventList from '../components/events/EventList';
import EventMap from '../components/events/EventMap';
import '../styles/DiscoverPage.css';

export default function DiscoverPage({ email }) {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const { events, total, loading, error, filters, setFilter, resetFilters } = useEvents();

  const handleSearch = useCallback((val) => setFilter('search', val), [setFilter]);

  // Load saved comparisons from DB on mount
  useEffect(() => {
    async function loadSavedComparisons() {
      if (!email) return;
      try {
        const pref = await getPreference(email);
        if (!pref) return;
        const ids = [pref.comparison_1, pref.comparison_2, pref.comparison_3].filter(Boolean);
        if (ids.length === 0) return;
        const results = await Promise.all(ids.map(id => getEventByNumericId(id)));
        const valid = results.filter(Boolean);
        setSavedEvents(valid);
        setCompareIds(valid.map(e => e._id));
      } catch (err) {
        console.error('Failed to load saved comparisons:', err.message);
      }
    }
    loadSavedComparisons();
  }, [email]);

  async function handleToggleCompare(event) {
    const next = compareIds.includes(event._id)
      ? compareIds.filter(id => id !== event._id)
      : compareIds.length >= 3 ? compareIds : [...compareIds, event._id];

    setCompareIds(next);

    // Map _ids back to numeric ids and sync to DB
    const allKnown = [...events, ...savedEvents];
    const nextNumericIds = next.map(id => {
      const e = allKnown.find(ev => ev._id === id);
      return e?.id || null;
    }).filter(Boolean);

    try {
      await updatePreference(email, {
        comparison_1: nextNumericIds[0] || null,
        comparison_2: nextNumericIds[1] || null,
        comparison_3: nextNumericIds[2] || null,
      });
    } catch (err) {
      console.error('Failed to save comparison:', err.message);
    }
  }

  // Merge saved events with events from current list
  const compareEvents = compareIds.map(id =>
    events.find(e => e._id === id) || savedEvents.find(e => e._id === id)
  ).filter(Boolean);

  return (
    <div className="discover-page">
      <section className="discover-hero">
        <div className="discover-hero__text">
          <div className="discover-hero__heading-row">
            <h1 className="discover-hero__heading">
              Discover your <em className="discover-hero__accent">city's pulse.</em>
            </h1>
            <Link to="/discover-tonight" className="discover-tonight-btn">
              <i class="fa-solid fa-dice"></i>
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.5 }}>
                <p>Discover</p>
                <p>Tonight</p>
              </span>
            </Link>
          </div>
          <p className="discover-hero__sub">
            A unified view of concerts, festivals, and niche happenings. No logins, just exploration.
          </p>
        </div>
      </section>

      <div className="discover-toolbar">
        <SearchBar value={filters.search} onSearch={handleSearch} />
        <button
          className={`discover-toolbar__filter-btn ${filtersOpen ? 'active' : ''}`}
          onClick={() => setFiltersOpen(o => !o)}
        >
          <i className="fa-solid fa-filter"></i>
          Filters
        </button>
        <div className="view-toggle-container">
          <input
            type="checkbox"
            id="view-toggle-checkbox"
            checked={view === 'map'}
            onChange={(e) => setView(e.target.checked ? 'map' : 'list')}
          />
          <label htmlFor="view-toggle-checkbox" className="view-toggle-label">
            <span className="view-toggle-text view-toggle-text--list">LIST</span>
            <span className="view-toggle-text view-toggle-text--map">MAP</span>
          </label>
        </div>
      </div>

      {filtersOpen && <FilterBar filters={filters} onSetFilter={setFilter} onReset={resetFilters} />}

      {error && <div className="discover-page__error">Error: {error}</div>}

      {view === 'list' ? (
        <EventList
          events={events}
          loading={loading}
          total={total}
          filters={filters}
          onSetFilter={setFilter}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
        />
      ) : (
        <EventMap events={events} />
      )}

      {compareEvents.length > 0 && (
        <div className="discover-page__compare-bar">
          <span className="compare-bar__label">
            Comparing {compareEvents.length}/3 event{compareEvents.length !== 1 ? 's' : ''}
          </span>
          <div className="compare-bar__items">
            {compareEvents.map(e => (
              <span key={e._id} className="compare-bar__item">
                {e.title}
                <button onClick={() => handleToggleCompare(e)} className="compare-bar__remove">✕</button>
              </span>
            ))}
          </div>
          <button className="compare-bar__clear" onClick={() => {
            setCompareIds([]);
            setSavedEvents([]);
            updatePreference(email, { comparison_1: null, comparison_2: null, comparison_3: null })
              .catch(err => console.error('Failed to clear comparison:', err.message));
          }}>Clear</button>
          <button
            className="compare-bar__detail"
            onClick={() => navigate('/preferences#comparisons')}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
}

DiscoverPage.propTypes = {
  email: PropTypes.string.isRequired,
};