import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/EventMap.css';

// Fix default marker icon broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const coordCache = {};

async function geocodeCity(city) {
  const key = city.toLowerCase().trim();
  if (key in coordCache) return coordCache[key];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    const coords =
      data.length > 0 ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
    coordCache[key] = coords;
    return coords;
  } catch {
    coordCache[key] = null;
    return null;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

EventMap.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      date: PropTypes.string,
      time: PropTypes.string,
      category: PropTypes.string,
      isFree: PropTypes.bool,
      price: PropTypes.number,
      location: PropTypes.shape({
        city: PropTypes.string,
      }),
      sourceUrl: PropTypes.string,
    })
  ).isRequired,
};

export default function EventMap({ events }) {
  const [located, setLocated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!events.length) {
      setLocated([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const uniqueCities = [...new Set(events.map((e) => e.location?.city).filter(Boolean))];

    const cached = events
      .filter((e) => {
        const key = e.location?.city?.toLowerCase().trim();
        return key && coordCache[key];
      })
      .map((e) => ({ event: e, ...coordCache[e.location.city.toLowerCase().trim()] }));
    setLocated(cached);

    const toFetch = uniqueCities.filter((city) => !(city.toLowerCase().trim() in coordCache));

    if (toFetch.length === 0) {
      setLoading(false);
      return;
    }

    (async () => {
      for (let i = 0; i < toFetch.length; i++) {
        if (cancelled) break;
        const city = toFetch[i];
        const coords = await geocodeCity(city);
        if (coords && !cancelled) {
          setLocated((prev) => {
            const existing = new Set(prev.map((l) => l.event._id));
            const newItems = events
              .filter(
                (e) =>
                  e.location?.city?.toLowerCase().trim() === city.toLowerCase().trim() &&
                  !existing.has(e._id)
              )
              .map((e) => ({ event: e, ...coords }));
            return [...prev, ...newItems];
          });
        }
        if (i < toFetch.length - 1) await new Promise((r) => setTimeout(r, 1100));
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [events]);

  if (!events.length) {
    return <p className="event-map__empty">No events to display on map.</p>;
  }

  return (
    <section className="event-map" aria-label="Events map">
      {loading && located.length === 0 && (
        <p className="event-map__status" aria-live="polite">
          Locating events…
        </p>
      )}
      {loading && located.length > 0 && (
        <p className="event-map__status event-map__status--overlay" aria-live="polite">
          Loading more locations…
        </p>
      )}
      <MapContainer
        center={[20, 0]}
        zoom={3}
        className="event-map__container"
        aria-label="Interactive event map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map(({ event, lat, lng }) => (
          <Marker key={event._id} position={[lat, lng]} title={event.title}>
            <Popup>
              <article className="event-map__popup">
                <h3 className="event-map__popup-title">{event.title}</h3>
                <p className="event-map__popup-meta">
                  {formatDate(event.date)}
                  {event.time && ` · ${event.time}`}
                </p>
                <p className="event-map__popup-meta">
                  {event.category}
                  {event.isFree ? (
                    <span className="event-map__free"> · Free</span>
                  ) : (
                    event.price > 0 && <span> · ${event.price}</span>
                  )}
                </p>
                {event.location?.city && (
                  <p className="event-map__popup-meta">{event.location.city}</p>
                )}
                {event.sourceUrl && (
                  <a href={event.sourceUrl} target="_blank" rel="noreferrer">
                    View event →
                  </a>
                )}
              </article>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}
