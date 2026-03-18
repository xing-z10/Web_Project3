import PropTypes from 'prop-types';
import '../../styles/FilterBar.css';

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
const PLATFORMS = ['Eventbrite', 'Meetup', 'Facebook Events', 'University', 'Venue'];

FilterBar.propTypes = {
  filters: PropTypes.shape({
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
    isFree: PropTypes.string,
    category: PropTypes.string,
    platform: PropTypes.string,
  }).isRequired,
  onSetFilter: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default function FilterBar({ filters, onSetFilter, onReset }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__row">
        <div className="filter-bar__group">
          <label className="filter-bar__label">From</label>
          <input
            type="date"
            className="filter-bar__input"
            value={filters.dateFrom || ''}
            onChange={(e) => onSetFilter('dateFrom', e.target.value)}
          />
        </div>
        <div className="filter-bar__group">
          <label className="filter-bar__label">To</label>
          <input
            type="date"
            className="filter-bar__input"
            value={filters.dateTo || ''}
            onChange={(e) => onSetFilter('dateTo', e.target.value)}
          />
        </div>
        <div className="filter-bar__group">
          <label className="filter-bar__label">Price</label>
          <select
            className="filter-bar__input"
            value={filters.isFree || ''}
            onChange={(e) => onSetFilter('isFree', e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Free</option>
            <option value="false">Paid</option>
          </select>
        </div>
        <div className="filter-bar__group">
          <label className="filter-bar__label">Category</label>
          <select
            className="filter-bar__input"
            value={filters.category || ''}
            onChange={(e) => onSetFilter('category', e.target.value)}
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-bar__group">
          <label className="filter-bar__label">Platform</label>
          <select
            className="filter-bar__input"
            value={filters.platform || ''}
            onChange={(e) => onSetFilter('platform', e.target.value)}
          >
            <option value="">All</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <button className="filter-bar__reset" onClick={onReset}>
          Clear
        </button>
      </div>
    </div>
  );
}
