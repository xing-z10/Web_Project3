const BASE_URL = '/api';

// GET /api/events with optional filter params
export async function getEvents(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      params.set(key, val);
    }
  });
  const res = await fetch(`${BASE_URL}/events?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

// GET /api/events/today — 3 random events matching today's date
export async function getTodayEvents(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const res = await fetch(`${BASE_URL}/events/today?${query.toString()}`);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error('Failed to fetch today events');
  return res.json();
}

// GET /api/events/byid/:id — find by numeric id field
export async function getEventByNumericId(id) {
  const res = await fetch(`${BASE_URL}/events/byid/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch event');
  return res.json();
}

// GET /api/events/:id
export async function getEventById(id) {
  const res = await fetch(`${BASE_URL}/events/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch event');
  return res.json();
}

// POST /api/events
export async function createEvent(data) {
  const res = await fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create event');
  }
  return res.json();
}

// PUT /api/events/:id
export async function updateEvent(id, data) {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update event');
  return res.json();
}

// DELETE /api/events/:id
export async function deleteEvent(id) {
  const res = await fetch(`${BASE_URL}/events/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete event');
  return res.json();
}

// POST /api/events/:id/view — increment view counter
export async function incrementView(id) {
  const res = await fetch(`${BASE_URL}/events/${id}/view`, { method: 'POST' });
  if (!res.ok) return;
  return res.json();
}