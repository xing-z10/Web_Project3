const BASE_URL = 'http://localhost:5001/api';

// GET preference by email
export async function getPreference(email) {
  const res = await fetch(`${BASE_URL}/preferences/${encodeURIComponent(email)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch preference');
  return res.json();
}

// POST create new preference
export async function createPreference(data) {
  const res = await fetch(`${BASE_URL}/preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create preference');
  return res.json();
}

// PUT update preference fields
export async function updatePreference(email, data) {
  const res = await fetch(`${BASE_URL}/preferences/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update preference');
  return res.json();
}

// PUT update comparison events
export async function updateComparison(email, comparison_1, comparison_2, comparison_3) {
  const res = await fetch(`${BASE_URL}/preferences/${encodeURIComponent(email)}/comparison`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comparison_1, comparison_2, comparison_3 }),
  });
  if (!res.ok) throw new Error('Failed to update comparison');
  return res.json();
}

// DELETE preference
export async function deletePreference(email) {
  const res = await fetch(`${BASE_URL}/preferences/${encodeURIComponent(email)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete preference');
  return res.json();
}