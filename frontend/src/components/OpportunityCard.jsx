import React from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import Badge from "./Badge";

// Helper to assign a pastel badge variant according to domain
const getDomainBadgeVariant = (domain = "") => {
  const d = domain.toLowerCase();
  if (d.includes("soft") || d.includes("dev") || d.includes("web") || d.includes("front") || d.includes("back")) {
    return "mint";
  }
  if (d.includes("design") || d.includes("ui") || d.includes("ux") || d.includes("product design")) {
    return "rose";
  }
  if (d.includes("data") || d.includes("ai") || d.includes("ml") || d.includes("cloud") || d.includes("analyt")) {
    return "sky";
  }
  if (d.includes("market") || d.includes("content") || d.includes("growth") || d.includes("seo") || d.includes("sales")) {
    return "peach";
  }
  return "lavender";
};

// Helper for company initial avatar color
const getCompanyInitials = (name = "") => {
  if (!name) return "CO";
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const OpportunityCard = ({ opportunity }) => {
  if (!opportunity) return null;

  const id = opportunity._id || opportunity.id;
  const badgeVariant = getDomainBadgeVariant(opportunity.domain);
  const initials = getCompanyInitials(opportunity.companyName);

  return (
    <Card interactive className="opportunity-card">
      <div className="opportunity-card-header">
        <div className="company-info-group">
          <div className={`company-avatar avatar-${badgeVariant}`}>
            {initials}
          </div>
          <div>
            <span className="company-name">{opportunity.companyName}</span>
            <div className="opportunity-type-pill">Internship & Job</div>
          </div>
        </div>

        <Badge variant={badgeVariant} className="domain-badge">
          {opportunity.domain}
        </Badge>
      </div>

      <h3 className="opportunity-title" title={opportunity.title}>
        {opportunity.title}
      </h3>

      {opportunity.description && (
        <p className="opportunity-description">
          {opportunity.description}
        </p>
      )}

      <div className="opportunity-metadata">
        <div className="meta-item">
          <span className="meta-icon" role="img" aria-label="location">
            📍
          </span>
          <span className="meta-text">{opportunity.location || "Remote"}</span>
        </div>

        <div className="meta-item">
          <span className="meta-icon" role="img" aria-label="experience">
            💼
          </span>
          <span className="meta-text">{opportunity.experience || "Fresher"}</span>
        </div>
      </div>

      <div className="opportunity-card-footer">
        <Link
          to={`/opportunities/${id}`}
          className="btn btn-primary btn-view-details"
        >
          <span>View Details</span>
          <svg
            className="arrow-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </Card>
  );
};

export default OpportunityCard;
