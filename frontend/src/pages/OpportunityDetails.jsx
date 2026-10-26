import React from "react";
import { useParams, Link } from "react-router-dom";

const OpportunityDetails = () => {
  const { id } = useParams();

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link to="/">← Back to Opportunities</Link>
      </div>

      <div className="placeholder-card">
        <h3>📄 Opportunity Details</h3>
        <p>Route: <code>/opportunities/{id}</code></p>
        <p className="placeholder-desc">
          Viewing details for opportunity ID: <strong>{id}</strong>.
          This page will show full job description, company name, location, and experience required.
        </p>
        <div className="placeholder-actions">
          <Link to={`/apply/${id}`} className="btn btn-primary">
            Apply Now (/apply/:id)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
