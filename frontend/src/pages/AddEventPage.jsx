import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';
import '../styles/AddEventPage.css';

const CATEGORIES = [
  'Art Exhibitions',
  'Board Games',
  'Comic Concerts',
  'Concerts',
  'Livehouses',
  'Movie Premieres',
  'Parties',
  'Theaters',
];
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
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
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
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const newEvent = await createEvent({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags
          ? form.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        date: form.date,
        time: form.time,
        location: { address: form.address.trim(), city: form.city.trim() },
        isFree: form.isFree,
        price: form.isFree ? 0 : parseFloat(form.price) || 0,
        imageUrl: form.imageUrl.trim(),
        sourceUrl: form.sourceUrl.trim(),
        sourcePlatform: form.sourcePlatform,
      });
      navigate(`/?newId=${newEvent._id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="add-event-page">
      <div className="add-event-page__card">
        <h1 className="add-event-page__title">
          Add an <span className="add-event-page__title-accent">Event</span>
        </h1>
        <p className="add-event-page__subtitle">
          Surface a niche happening that isn't listed on major platforms.
        </p>

        {submitError && (
          <p className="add-event__alert" role="alert">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Add event form">
          <fieldset className="add-event__fieldset">
            <legend className="add-event__section-label">Event Details</legend>

            <div className="add-event__field">
              <label htmlFor="event-title">
                Title{' '}
                <span className="req" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="event-title"
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Underground Jazz at The Vault"
                aria-required="true"
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <span id="title-error" className="add-event__error" role="alert">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="add-event__field">
              <label htmlFor="event-desc">Description</label>
              <textarea
                id="event-desc"
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Brief description of the event..."
              />
            </div>

            <div className="add-event__row">
              <div className="add-event__field">
                <label htmlFor="event-category">
                  Category{' '}
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <select
                  id="event-category"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  aria-required="true"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="add-event__error" role="alert">
                    {errors.category}
                  </span>
                )}
              </div>
              <div className="add-event__field">
                <label htmlFor="event-tags">Tags</label>
                <input
                  id="event-tags"
                  type="text"
                  value={form.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  placeholder="jazz, free, outdoor (comma-separated)"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="add-event__fieldset">
            <legend className="add-event__section-label">Date & Time</legend>
            <div className="add-event__row">
              <div className="add-event__field">
                <label htmlFor="event-date">
                  Date{' '}
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="event-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  aria-required="true"
                />
                {errors.date && (
                  <span className="add-event__error" role="alert">
                    {errors.date}
                  </span>
                )}
              </div>
              <div className="add-event__field">
                <label htmlFor="event-time">Time</label>
                <input
                  id="event-time"
                  type="time"
                  value={form.time}
                  onChange={(e) => set('time', e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="add-event__fieldset">
            <legend className="add-event__section-label">Location</legend>
            <div className="add-event__row">
              <div className="add-event__field" style={{ flex: 2 }}>
                <label htmlFor="event-address">Address</label>
                <input
                  id="event-address"
                  type="text"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="123 Main St"
                />
              </div>
              <div className="add-event__field">
                <label htmlFor="event-city">
                  City{' '}
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="event-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="New York"
                  aria-required="true"
                />
                {errors.city && (
                  <span className="add-event__error" role="alert">
                    {errors.city}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="add-event__fieldset">
            <legend className="add-event__section-label">Pricing</legend>
            <div className="add-event__row add-event__row--align-center">
              <label className="add-event__toggle">
                <input
                  type="checkbox"
                  checked={form.isFree}
                  onChange={(e) => set('isFree', e.target.checked)}
                />
                <span>This event is free</span>
              </label>
              {!form.isFree && (
                <div className="add-event__field">
                  <label htmlFor="event-price">
                    Price ($){' '}
                    <span className="req" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="event-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <span className="add-event__error" role="alert">
                      {errors.price}
                    </span>
                  )}
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className="add-event__fieldset">
            <legend className="add-event__section-label">Source</legend>
            <div className="add-event__row">
              <div className="add-event__field" style={{ flex: 2 }}>
                <label htmlFor="event-source-url">
                  Source URL{' '}
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="event-source-url"
                  type="url"
                  value={form.sourceUrl}
                  onChange={(e) => set('sourceUrl', e.target.value)}
                  placeholder="https://eventbrite.com/..."
                  aria-required="true"
                />
                {errors.sourceUrl && (
                  <span className="add-event__error" role="alert">
                    {errors.sourceUrl}
                  </span>
                )}
              </div>
              <div className="add-event__field">
                <label htmlFor="event-platform">Platform</label>
                <select
                  id="event-platform"
                  value={form.sourcePlatform}
                  onChange={(e) => set('sourcePlatform', e.target.value)}
                >
                  <option value="">Select platform</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="add-event__field">
              <label htmlFor="event-image">Image URL</label>
              <input
                id="event-image"
                type="url"
                value={form.imageUrl}
                onChange={(e) => set('imageUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </fieldset>

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
    </main>
  );
}
