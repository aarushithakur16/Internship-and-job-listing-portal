import React from "react";
import { Link } from "react-router-dom";

const AdminApplications = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Candidate Applications</h2>
          <p className="page-subtitle">
            Review submitted applications and candidate details.
          </p>
        </div>
      </div>

      <div className="placeholder-card">
        <h3>📬 View Applications</h3>
        <p>Route: <code>/admin/applications</code></p>
        <p className="placeholder-desc">
          This page displays all candidate applications, including applicant name, email, phone, resume link, and linked opportunity title and company.
        </p>
        <div className="placeholder-actions">
          <Link to="/admin" className="btn btn-secondary">
            ← Back to Opportunities Management
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
