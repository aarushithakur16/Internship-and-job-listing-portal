import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Admin Opportunities Management</h2>
          <p className="page-subtitle">
            Create, edit, or delete job and internship postings.
          </p>
        </div>
      </div>

      <div className="placeholder-card">
        <h3>⚙️ Opportunity Management</h3>
        <p>Route: <code>/admin</code></p>
        <p className="placeholder-desc">
          This dashboard allows the admin to add new opportunities, edit existing ones, or delete outdated listings.
        </p>
        <div className="placeholder-actions">
          <Link to="/admin/applications" className="btn btn-secondary">
            Go to View Applications (/admin/applications)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
