import React from "react";

const DomainFilter = ({
  domains = [],
  selectedDomain = "All",
  onSelectDomain,
  className = "",
}) => {
  const allOptions = ["All", ...domains];

  return (
    <div className={`domain-filter-section ${className}`}>
      {/* Domain Chips */}
      <div className="domain-chips-wrapper" role="radiogroup" aria-label="Filter by domain">
        {allOptions.map((domain) => {
          const isActive = selectedDomain === domain;
          return (
            <button
              key={domain}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`domain-chip ${isActive ? "active" : ""}`}
              onClick={() => onSelectDomain(domain)}
            >
              {domain === "All" ? "✨ All Opportunities" : domain}
            </button>
          );
        })}
      </div>

      {/* Synchronized Dropdown for compact / accessible filter selection */}
      <div className="domain-dropdown-container">
        <label htmlFor="domain-select" className="domain-dropdown-label">
          Category:
        </label>
        <select
          id="domain-select"
          className="domain-select-control"
          value={selectedDomain}
          onChange={(e) => onSelectDomain(e.target.value)}
          aria-label="Select domain category"
        >
          {allOptions.map((domain) => (
            <option key={domain} value={domain}>
              {domain === "All" ? "All Domains" : domain}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DomainFilter;
