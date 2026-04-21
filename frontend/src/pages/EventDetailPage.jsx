import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import '../styles/EventDetailPage.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEventById(id)
      .then((data) => {
        if (!data) setError('Event not found.');
        else setEvent(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <main className="event-detail">
        <p className="event-detail__state">Loading…</p>
      </main>
    );
  if (error)
    return (
      <main className="event-detail">
        <p className="event-detail__state event-detail__state--error">{error}</p>
      </main>
    );

  const imageSrc =
    event.imageUrl ||
    `/images/category-defaults/${(event.category || 'default').toLowerCase().replace(/\s+/g, '-')}.jpg`;

  return (
    <main className="event-detail">
      <button className="event-detail__back" onClick={() => navigate(-1)} aria-label="Go back">
        ← Back
      </button>

      <div className="event-detail__hero">
        <img className="event-detail__img" src={imageSrc} alt={event.title} />
        <div className="event-detail__hero-overlay">
          {event.category && <span className="event-detail__category">{event.category}</span>}
          <span
            className={`event-detail__price ${event.isFree ? 'event-detail__price--free' : ''}`}
          >
            {event.isFree ? 'Free' : event.price > 0 ? `$${event.price}` : ''}
          </span>
        </div>
      </div>

      <div className="event-detail__body">
        <h1 className="event-detail__title">{event.title}</h1>

        <dl className="event-detail__meta">
          {event.date && (
            <>
              <dt>Date</dt>
              <dd>
                {formatDate(event.date)}
                {event.time ? ` · ${event.time}` : ''}
              </dd>
            </>
          )}
          {(event.location?.address || event.location?.city) && (
            <>
              <dt>Location</dt>
              <dd>{[event.location.address, event.location.city].filter(Boolean).join(', ')}</dd>
            </>
          )}
          {event.views > 0 && (
            <>
              <dt>Views</dt>
              <dd>{event.views}</dd>
            </>
          )}
        </dl>

        {event.description && (
          <section className="event-detail__section">
            <h2 className="event-detail__section-title">About</h2>
            <p className="event-detail__description">{event.description}</p>
          </section>
        )}

        {Array.isArray(event.tags) && event.tags.length > 0 && (
          <section className="event-detail__section">
            <h2 className="event-detail__section-title">Tags</h2>
            <ul className="event-detail__tags">
              {event.tags.map((tag) => (
                <li key={tag} className="event-detail__tag">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
