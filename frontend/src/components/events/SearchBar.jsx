import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../../styles/SearchBar.css';

SearchBar.propTypes = {
  value: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default function SearchBar({ value, onSearch }) {
  const [input, setInput] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input, onSearch]);

  return (
    <search className="search-bar">
      <label htmlFor="search-input" className="sr-only">
        Search events
      </label>
      <span className="search-bar__icon" aria-hidden="true">
        🔍
      </span>
      <input
        id="search-input"
        className="search-bar__input"
        type="search"
        placeholder="Search by keyword, tag, or venue..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Search events"
      />
      {input && (
        <button
          className="search-bar__clear"
          onClick={() => setInput('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </search>
  );
}
