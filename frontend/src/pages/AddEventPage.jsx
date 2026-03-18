import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';
import '../styles/AddEventPage.css';

const CATEGORIES = ['Music', 'Tech', 'Food', 'Art', 'Sports', 'Community', 'Film', 'Education', 'Outdoors', 'Other'];
const PLATFORMS = ['Eventbrite', 'Meetup', 'Facebook Events', 'University', 'Venue', 'Other'];

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  tags: '',
  date: '',
  time: '',
  address: '',
  city: '',
  isFree: true,
  price: '',
  imageUrl: '',
  sourceUrl: '',
  sourcePlatform: '',
};

export default function AddEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.sourceUrl.trim()) e.sourceUrl = 'Source URL is required';
    if (!form.isFree && !form.price) e.price = 'Enter a price or mark as free';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      await createEvent({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        date: form.date,
        time: form.time,
        location: {
          address: form.address.trim(),
          city: form.city.trim(),
        },
        isFree: form.isFree,
        price: form.isFree ? 0 : parseFloat(form.price) || 0,
        imageUrl: form.imageUrl.trim(),
        sourceUrl: form.sourceUrl.trim(),
        sourcePlatform: form.sourcePlatform,
      });
      navigate('/');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="add-event-page">
      <div className="add-event-page__card">
        <h1 className="add-event-page__title">Add an Event</h1>
        <p className="add-event-page__subtitle">
          Surface a niche happening that isn't listed on major platforms.
        </p>

        {submitError && <div className="add-event__alert">{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="add-event__section-label">Event Details</div>

          <div className="add-event__field">
            <label>Title <span className="req">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Underground Jazz at The Vault"
            />
            {errors.title && <span className="add-event__error">{errors.title}</span>}
          </div>

          <div className="add-event__field">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief description of the event..."
            />
          </div>

          <div className="add-event__row">
            <div className="add-event__field">
              <label>Category <span className="req">*</span></label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="add-event__error">{errors.category}</span>}
            </div>
            <div className="add-event__field">
              <label>Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="jazz, free, outdoor (comma-separated)"
              />
            </div>
          </div>

          <div className="add-event__section-label">Date & Time</div>

          <div className="add-event__row">
            <div className="add-event__field">
              <label>Date <span className="req">*</span></label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              {errors.date && <span className="add-event__error">{errors.date}</span>}
            </div>
            <div className="add-event__field">
              <label>Time</label>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
          </div>

          <div className="add-event__section-label">Location</div>

          <div className="add-event__row">
            <div className="add-event__field" style={{ flex: 2 }}>
              <label>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="123 Main St"
              />
            </div>
            <div className="add-event__field">
              <label>City <span className="req">*</span></label>
              <input
                type="text"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                placeholder="New York"
              />
              {errors.city && <span className="add-event__error">{errors.city}</span>}
            </div>
          </div>

          <div className="add-event__section-label">Pricing</div>

          <div className="add-event__row add-event__row--align-center">
            <label className="add-event__toggle">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={e => set('isFree', e.target.checked)}
              />
              <span>This event is free</span>
            </label>
            {!form.isFree && (
              <div className="add-event__field">
                <label>Price ($) <span className="req">*</span></label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="0.00"
                />
                {errors.price && <span className="add-event__error">{errors.price}</span>}
              </div>
            )}
          </div>

          <div className="add-event__section-label">Source</div>

          <div className="add-event__row">
            <div className="add-event__field" style={{ flex: 2 }}>
              <label>Source URL <span className="req">*</span></label>
              <input
                type="url"
                value={form.sourceUrl}
                onChange={e => set('sourceUrl', e.target.value)}
                placeholder="https://eventbrite.com/..."
              />
              {errors.sourceUrl && <span className="add-event__error">{errors.sourceUrl}</span>}
            </div>
            <div className="add-event__field">
              <label>Platform</label>
              <select value={form.sourcePlatform} onChange={e => set('sourcePlatform', e.target.value)}>
                <option value="">Select platform</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="add-event__field">
            <label>Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={e => set('imageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="add-event__actions">
            <button type="button" className="add-event__cancel" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="add-event__submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
