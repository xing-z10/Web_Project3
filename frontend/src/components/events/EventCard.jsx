import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { incrementView } from '../../services/eventService';
import '../../styles/EventCard.css';

const PLATFORM_COLORS = {
  eventbrite: '#f05537',
  meetup: '#e0393e',
  facebook: '#1877f2',
  default: '#6b7280',
};

const CATEGORY_IMAGES = {
  'art exhibitions': '/images/category-defaults/art.jpg',
  'board games': '/images/category-defaults/community.jpg',
  'comic concerts': '/images/category-defaults/music.jpg',
  concerts: '/images/category-defaults/concert.jpg',
  livehouses: '/images/category-defaults/livehouse.jpg',
  'movie premieres': '/images/category-defaults/film.jpg',
  parties: '/images/category-defaults/parties.jpg',
  theaters: '/images/category-defaults/theaters.jpg',
};

function getCategoryImage(category) {
  if (!category) return '/images/category-defaults/default.jpg';
  return CATEGORY_IMAGES[category.toLowerCase()] || '/images/category-defaults/default.jpg';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function EventCard({ event, selected, onToggleCompare }) {
  const platform = (event.sourcePlatform || '').toLowerCase();
  const badgeColor = PLATFORM_COLORS[platform] || PLATFORM_COLORS.default;
  const imageSrc = event.imageUrl || getCategoryImage(event.category);

  function handleCardClick() {
    if (event._id) incrementView(event._id);
  }

  return (
    <article className={`event-card ${selected ? 'event-card--selected' : ''}`}>
      <Link
        className="event-card__main"
        to={`/events/${event._id}`}
        onClick={handleCardClick}
        aria-label={`View details for ${event.title}`}
      >
        <div className="event-card__img-wrap">
          <img className="event-card__img" src={imageSrc} alt={event.title} />
          <div className="event-card__img-badges">
            {event.category && <span className="event-card__category">{event.category}</span>}
            {event.isFree ? (
              <span className="event-card__badge event-card__badge--free">Free</span>
            ) : (
              event.price > 0 && (
                <span className="event-card__badge event-card__badge--paid">${event.price}</span>
              )
            )}
          </div>
        </div>

        <div className="event-card__body">
          <p className="event-card__meta">
            {formatDate(event.date)}
            {event.time ? ` · ${event.time}` : ''}
            {event.views > 0 && (
              <span className="event-card__views">
                {' '}
                <i className="fa-regular fa-eye"></i> {event.views}
              </span>
            )}
          </p>
          <h3 className="event-card__title">{event.title}</h3>
          {event.location && (
            <p className="event-card__location">
              {[event.location.address, event.location.city].filter(Boolean).join(', ')}
            </p>
          )}
          <div className="event-card__footer">
            {event.sourcePlatform && (
              <a
                className="event-card__source"
                style={{ background: badgeColor }}
                href={event.sourceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {event.sourcePlatform}
              </a>
            )}
          </div>
        </div>
      </Link>

      {onToggleCompare && (
        <button
          className={`event-card__compare ${selected ? 'active' : ''}`}
          onClick={() => onToggleCompare(event)}
          title={selected ? 'Remove from compare' : 'Add to compare'}
          aria-pressed={selected}
          aria-label={
            selected ? `Remove ${event.title} from compare` : `Add ${event.title} to compare`
          }
        >
          {selected ? '✓' : 'Compare'}
        </button>
      )}
    </article>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    time: PropTypes.string,
    category: PropTypes.string,
    isFree: PropTypes.bool,
    price: PropTypes.number,
    views: PropTypes.number,
    imageUrl: PropTypes.string,
    location: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
    }),
    sourcePlatform: PropTypes.string,
    sourceUrl: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool,
  onToggleCompare: PropTypes.func,
};

EventCard.defaultProps = {
  selected: false,
  onToggleCompare: null,
};
