import React from "react";

const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  helperText,
  required = false,
  className = "",
  ...props
}) => {
  const selectId = id || name;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && <span style={{ color: "var(--accent-rose)" }}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-select ${error ? "error" : ""}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}
        {options.map((opt, idx) => {
          const optValue = typeof opt === "object" ? opt.value : opt;
          const optLabel = typeof opt === "object" ? opt.label : opt;
          return (
            <option key={idx} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      {error && <span className="form-error">{error}</span>}
      {helperText && !error && <span className="form-helper">{helperText}</span>}
    </div>
  );
};

export default Select;
