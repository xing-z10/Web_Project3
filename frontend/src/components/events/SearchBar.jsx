import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../../styles/SearchBar.css';

SearchBar.propTypes = {
  value: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default function SearchBar({ value, onSearch }) {
  const [input, setInput] = useState(value || '');

  // Debounce: fire onSearch 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input, onSearch]);

  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        className="search-bar__input"
        type="text"
        placeholder="Search by keyword, tag, or venue..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {input && (
        <button className="search-bar__clear" onClick={() => setInput('')}>
          ✕
        </button>
      )}
    </div>
  );
}
