import React from "react";

const Spinner = ({ size = "md", className = "" }) => {
  return (
    <div className={`spinner-container ${className}`}>
      <div className={`spinner spinner-${size}`} role="status" aria-label="Loading" />
    </div>
  );
};

export default Spinner;
