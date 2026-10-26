import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ApplyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link to={`/opportunities/${id}`}>← Back to Opportunity</Link>
      </div>

      <div className="placeholder-card">
        <h3>📝 Submit Application Form</h3>
        <p>Route: <code>/apply/{id}</code></p>
        <p className="placeholder-desc">
          Application submission for Opportunity ID: <strong>{id}</strong>.
          This page will have inputs for applicant name, email, phone number, and optional resume link.
        </p>
        <div className="placeholder-actions">
          <button
            onClick={() => navigate("/confirmation")}
            className="btn btn-primary"
          >
            Simulate Submit → Go to Confirmation (/confirmation)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;
