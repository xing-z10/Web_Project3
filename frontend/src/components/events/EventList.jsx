import EventCard from './EventCard';
import '../../styles/EventList.css';

export default function EventList({ events, loading, total, filters, onSetFilter, compareIds, onToggleCompare }) {
  if (loading) {
    return <div className="event-list__status">Loading events...</div>;
  }

  if (!events.length) {
    return <div className="event-list__status event-list__empty">No events found. Try adjusting your filters.</div>;
  }

  const totalPages = Math.ceil(total / (filters.limit || 20));
  const currentPage = filters.page || 1;

  return (
    <div className="event-list">
      <div className="event-list__header">
        <h2 className="event-list__heading">
          Featured Events
          <span className="event-list__count">{total} result{total !== 1 ? 's' : ''}</span>
        </h2>
      </div>
      <div className="event-list__grid">
        {events.map(event => (
          <EventCard
            key={event._id}
            event={event}
            selected={compareIds?.includes(event._id)}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="event-list__pagination">
          <button
            className="event-list__page-btn"
            disabled={currentPage <= 1}
            onClick={() => onSetFilter('page', currentPage - 1)}
          >
            ← Prev
          </button>
          <span className="event-list__page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="event-list__page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onSetFilter('page', currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
