import { incrementView } from '../../services/eventService';
import '../../styles/EventCard.css';

const PLATFORM_COLORS = {
  eventbrite: '#f05537',
  meetup: '#e0393e',
  facebook: '#1877f2',
  default: '#6b7280',
};

const CATEGORY_IMAGES = {
  music:     '/images/category-defaults/music.jpg',
  tech:      '/images/category-defaults/tech.jpg',
  food:      '/images/category-defaults/food.jpg',
  art:       '/images/category-defaults/art.jpg',
  sports:    '/images/category-defaults/sports.jpg',
  community: '/images/category-defaults/community.jpg',
  film:      '/images/category-defaults/film.jpg',
  education: '/images/category-defaults/education.jpg',
  outdoors:  '/images/category-defaults/outdoors.jpg',
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
    <div className={`event-card ${selected ? 'event-card--selected' : ''}`} onClick={handleCardClick}>
      <div className="event-card__img-wrap">
        <img className="event-card__img" src={imageSrc} alt={event.title} />
        <div className="event-card__img-badges">
          {event.category && (
            <span className="event-card__category">{event.category}</span>
          )}
          {event.isFree
            ? <span className="event-card__badge event-card__badge--free">Free</span>
            : event.price > 0 && <span className="event-card__badge event-card__badge--paid">${event.price}</span>
          }
        </div>
        {onToggleCompare && (
          <button
            className={`event-card__compare ${selected ? 'active' : ''}`}
            onClick={e => { e.stopPropagation(); onToggleCompare(event); }}
            title={selected ? 'Remove from compare' : 'Add to compare'}
          >
            {selected ? '✓' : '+'}
          </button>
        )}
      </div>

      <div className="event-card__body">
        <p className="event-card__meta">
          {formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}
          {event.views > 0 && <span className="event-card__views"> <i class="fa-regular fa-eye"></i> {event.views}</span>}
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
              onClick={e => e.stopPropagation()}
            >
              {event.sourcePlatform}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
