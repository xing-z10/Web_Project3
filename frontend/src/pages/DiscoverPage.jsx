import { useState, useCallback } from 'react';
import { useEvents } from '../hooks/useEvents';
import FilterBar from '../components/events/FilterBar';
import SearchBar from '../components/events/SearchBar';
import EventList from '../components/events/EventList';
import EventMap from '../components/events/EventMap';
import '../styles/DiscoverPage.css';

export default function DiscoverPage() {
  const [view, setView] = useState('list'); // 'list' | 'map'
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
      <div className="discover-page__header">
        <h1 className="discover-page__title">Discover Events</h1>
        <div className="discover-page__view-toggle">
          <button
            className={`view-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            ☰ List
          </button>
          <button
            className={`view-btn ${view === 'map' ? 'active' : ''}`}
            onClick={() => setView('map')}
          >
            🗺 Map
          </button>
        </div>
      </div>

      <SearchBar value={filters.search} onSearch={handleSearch} />
      <FilterBar filters={filters} onSetFilter={setFilter} onReset={resetFilters} />

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
