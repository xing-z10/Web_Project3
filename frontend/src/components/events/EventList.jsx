import PropTypes from 'prop-types';
import EventCard from './EventCard';
import '../../styles/EventList.css';

EventList.propTypes = {
  events: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  total: PropTypes.number.isRequired,
  filters: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number,
  }).isRequired,
  onSetFilter: PropTypes.func.isRequired,
  compareIds: PropTypes.arrayOf(PropTypes.string),
  onToggleCompare: PropTypes.func,
};

export default function EventList({
  events,
  loading,
  total,
  filters,
  onSetFilter,
  compareIds,
  onToggleCompare,
}) {
  if (loading) {
    return (
      <p className="event-list__status" aria-live="polite">
        Loading events...
      </p>
    );
  }

  if (!events.length) {
    return (
      <p className="event-list__status event-list__empty">
        No events found. Try adjusting your filters.
      </p>
    );
  }

  const totalPages = Math.ceil(total / (filters.limit || 20));
  const currentPage = filters.page || 1;

  return (
    <section className="event-list" aria-label="Event results">
      <header className="event-list__header">
        <h2 className="event-list__heading">
          Featured Events
          <span className="event-list__count">
            {total} result{total !== 1 ? 's' : ''}
          </span>
        </h2>
      </header>
      <ul className="event-list__grid">
        {events.map((event) => (
          <li key={event._id}>
            <EventCard
              event={event}
              selected={compareIds?.includes(event._id)}
              onToggleCompare={onToggleCompare}
            />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <nav className="event-list__pagination" aria-label="Pagination">
          <button
            className="event-list__page-btn"
            disabled={currentPage <= 1}
            onClick={() => onSetFilter('page', currentPage - 1)}
            aria-label="Previous page"
          >
            ← Prev
          </button>
          <span className="event-list__page-info" aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="event-list__page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onSetFilter('page', currentPage + 1)}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}
