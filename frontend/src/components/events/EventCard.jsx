import { incrementView } from '../../services/eventService';
import '../../styles/EventCard.css';

const PLATFORM_COLORS = {
  eventbrite: '#f05537',
  meetup: '#e0393e',
  facebook: '#1877f2',
  default: '#6b7280',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function EventCard({ event, selected, onToggleCompare }) {
  const platform = (event.sourcePlatform || '').toLowerCase();
  const badgeColor = PLATFORM_COLORS[platform] || PLATFORM_COLORS.default;

  function handleCardClick() {
    if (event._id) incrementView(event._id);
  }

  return (
    <div className={`event-card ${selected ? 'event-card--selected' : ''}`} onClick={handleCardClick}>
      {event.imageUrl && (
        <img className="event-card__img" src={event.imageUrl} alt={event.title} />
      )}
      <div className="event-card__body">
        <div className="event-card__top">
          <span className="event-card__category">{event.category}</span>
          {event.isFree
            ? <span className="event-card__badge event-card__badge--free">Free</span>
            : event.price > 0 && <span className="event-card__badge event-card__badge--paid">${event.price}</span>
          }
        </div>
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__meta">
          {formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}
        </p>
        {event.location && (
          <p className="event-card__location">
            {[event.location.address, event.location.city].filter(Boolean).join(', ')}
          </p>
        )}
        <div className="event-card__footer">
          <div className="event-card__stats">
            {event.views > 0 && <span>👁 {event.views}</span>}
            {event.saves > 0 && <span>🔖 {event.saves}</span>}
          </div>
          <div className="event-card__actions">
            {event.sourcePlatform && (
              <a
                className="event-card__source"
                style={{ background: badgeColor }}
                href={event.sourceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
              >
                {event.sourcePlatform}
              </a>
            )}
            {onToggleCompare && (
              <button
                className={`event-card__compare ${selected ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); onToggleCompare(event); }}
                title={selected ? 'Remove from compare' : 'Add to compare'}
              >
                {selected ? '✓ Compare' : '+ Compare'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
