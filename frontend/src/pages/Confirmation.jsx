import React from "react";
import { Link, useLocation } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();
  const { opportunityTitle, companyName, applicantName } = location.state || {};

  return (
    <div className="page-container confirmation-container">
      {/* Centered Pastel Success Card */}
      <div className="confirmation-card">
        {/* Pastel Check Icon */}
        <div className="confirmation-icon-wrap" aria-hidden="true">
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="confirmation-title">Application Submitted!</h1>

        <p className="confirmation-message">
          {applicantName ? `Thank you, ${applicantName}! ` : ""}
          Your application has been received successfully. The hiring team has been notified and will review your profile shortly.
        </p>

        {/* Confirmation Metadata Receipt Box */}
        {(opportunityTitle || companyName) && (
          <div className="confirmation-details-box">
            {opportunityTitle && (
              <div className="confirmation-detail-item">
                <span className="confirmation-detail-label">Role</span>
                <span className="confirmation-detail-val">{opportunityTitle}</span>
              </div>
            )}
            {companyName && (
              <div className="confirmation-detail-item">
                <span className="confirmation-detail-label">Company</span>
                <span className="confirmation-detail-val">{companyName}</span>
              </div>
            )}
            <div className="confirmation-detail-item">
              <span className="confirmation-detail-label">Status</span>
              <span className="confirmation-detail-val" style={{ color: "var(--accent-mint-text, #065f46)" }}>
                ● Submitted to Database
              </span>
            </div>
          </div>
        )}

        {/* Back to Opportunities Button */}
        <div className="confirmation-actions">
          <Link to="/" className="btn btn-primary" style={{ padding: "0.85rem 2.25rem", fontSize: "1rem" }}>
            Back to opportunities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
