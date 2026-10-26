import React from "react";
import { Link } from "react-router-dom";

const OpportunityList = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <span className="pill-badge">🚀 Launch Your Career</span>
        <h1 className="hero-title">Find Your Dream Internship & Job</h1>
        <p className="hero-subtitle">
          Explore curated opportunities across Web Development, Data Science, Design, and Marketing.
        </p>
      </div>

      <div className="placeholder-card">
        <h3>📋 Opportunity Listing Page</h3>
        <p>Route: <code>/</code></p>
        <p className="placeholder-desc">
          This page will show the search bar, domain filters, and listings grid.
        </p>
        <div className="placeholder-actions">
          <Link to="/opportunities/sample-id" className="btn btn-primary">
            Preview Opportunity Details (/opportunities/:id)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpportunityList;
