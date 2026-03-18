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

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function EventMap({ events }) {
  // Find the first event with valid coordinates to center the map
  const eventsWithCoords = events.filter(
    e => e.location?.lat && e.location?.lng
  );

  const center = eventsWithCoords.length > 0
    ? [eventsWithCoords[0].location.lat, eventsWithCoords[0].location.lng]
    : [40.7128, -74.006]; // Default: New York City

  if (eventsWithCoords.length === 0) {
    return (
      <div className="event-map__empty">
        No events with location data to display on map.
      </div>
    );
  }

  return (
    <div className="event-map">
      <MapContainer center={center} zoom={12} className="event-map__container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {eventsWithCoords.map(event => (
          <Marker
            key={event._id}
            position={[event.location.lat, event.location.lng]}
          >
            <Popup>
              <div className="event-map__popup">
                <strong>{event.title}</strong>
                <br />
                <span>{formatDate(event.date)}</span>
                {event.time && <span> · {event.time}</span>}
                <br />
                <span>{event.category}</span>
                {event.isFree
                  ? <span className="event-map__free"> · Free</span>
                  : event.price > 0 && <span> · ${event.price}</span>
                }
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
