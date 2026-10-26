import React from "react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search by role, company, or keywords...",
  onClear,
  className = "",
  autoFocus = false,
}) => {
  return (
    <div className={`search-bar-wrapper ${className}`}>
      <div className="search-bar-inner">
        <span className="search-icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search opportunities"
          autoFocus={autoFocus}
        />

        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear || (() => onChange(""))}
            aria-label="Clear search"
            title="Clear search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
