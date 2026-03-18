import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import FilterBar from '../components/events/FilterBar';
import SearchBar from '../components/events/SearchBar';
import EventList from '../components/events/EventList';
import EventMap from '../components/events/EventMap';
import '../styles/DiscoverPage.css';

export default function DiscoverPage() {
  const [view, setView] = useState('list'); // 'list' | 'map'
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const { events, total, loading, error, filters, setFilter, resetFilters } = useEvents();

  const handleSearch = useCallback((val) => setFilter('search', val), [setFilter]);

  function handleToggleCompare(event) {
    setCompareIds(prev => {
      if (prev.includes(event._id)) return prev.filter(id => id !== event._id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, event._id];
    });
  }

  const compareEvents = events.filter(e => compareIds.includes(e._id));

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
          <button className="compare-bar__clear" onClick={() => setCompareIds([])}>Clear</button>
        </div>
      )}
    </div>
  );
}
