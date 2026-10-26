import React from "react";
import { Link } from "react-router-dom";

const Confirmation = () => {
  return (
    <div className="page-container">
      <div className="placeholder-card success-card">
        <div className="success-icon">🎉</div>
        <h3>Application Confirmed!</h3>
        <p>Route: <code>/confirmation</code></p>
        <p className="placeholder-desc">
          Your application has been received successfully. The hiring team has been notified.
        </p>
        <div className="placeholder-actions">
          <Link to="/" className="btn btn-primary">
            Explore More Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
