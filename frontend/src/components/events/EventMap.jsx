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

// Module-level cache persists across renders and view switches
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

    // Immediately place events whose cities are already cached
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
        // Nominatim rate limit: max 1 req/sec
        if (i < toFetch.length - 1) await new Promise((r) => setTimeout(r, 1100));
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [events]);

  if (!events.length) {
    return <div className="event-map__empty">No events to display on map.</div>;
  }

  return (
    <div className="event-map">
      {loading && located.length === 0 && <div className="event-map__status">Locating events…</div>}
      {loading && located.length > 0 && (
        <div className="event-map__status event-map__status--overlay">Loading more locations…</div>
      )}
      <MapContainer center={[20, 0]} zoom={3} className="event-map__container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map(({ event, lat, lng }) => (
          <Marker key={event._id} position={[lat, lng]}>
            <Popup>
              <div className="event-map__popup">
                <strong>{event.title}</strong>
                <br />
                <span>{formatDate(event.date)}</span>
                {event.time && <span> · {event.time}</span>}
                <br />
                <span>{event.category}</span>
                {event.isFree ? (
                  <span className="event-map__free"> · Free</span>
                ) : (
                  event.price > 0 && <span> · ${event.price}</span>
                )}
                {event.location?.city && (
                  <>
                    <br />
                    <span>{event.location.city}</span>
                  </>
                )}
                {event.sourceUrl && (
                  <>
                    <br />
                    <a href={event.sourceUrl} target="_blank" rel="noreferrer">
                      View event →
                    </a>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
