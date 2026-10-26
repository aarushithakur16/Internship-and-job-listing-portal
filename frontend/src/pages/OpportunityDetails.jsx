import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import API from "../services/api";

// Helper to assign pastel badge variant according to domain
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

// Helper for company initial avatar
const getCompanyInitials = (name = "") => {
  if (!name) return "CO";
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const OpportunityDetails = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null); // 400, 404, or 'network'
  const [errorMessage, setErrorMessage] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const response = await API.get(`/opportunities/${id}`);
        if (!isMounted) return;

        if (response.data) {
          setOpportunity(response.data);
          setErrorStatus(null);
          setErrorMessage("");
        } else {
          setErrorStatus(404);
          setErrorMessage("Opportunity details could not be found.");
        }
      } catch (err) {
        if (!isMounted) return;
        const status = err.response?.status;
        const message =
          err.response?.data?.message ||
          (err.code === "ERR_NETWORK"
            ? "Unable to connect to the backend server. Please verify the server is running on port 5000."
            : "An unexpected error occurred while loading this opportunity.");

        setErrorStatus(status || "network");
        setErrorMessage(message);
        setOpportunity(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="page-container details-page-wrapper">
        <div
          className="details-back-link skeleton-pulse"
          style={{ width: "160px", height: "36px", opacity: 0.6 }}
        />

        {/* Skeleton Header Card */}
        <div className="details-header-card skeleton-card">
          <div className="details-header-top">
            <div className="details-company-avatar-group">
              <div
                className="skeleton-avatar skeleton-pulse"
                style={{ width: "58px", height: "58px" }}
              />
              <div>
                <div
                  className="skeleton-line skeleton-pulse"
                  style={{ width: "140px", height: "18px", marginBottom: "8px" }}
                />
                <div
                  className="skeleton-line skeleton-pulse"
                  style={{ width: "90px", height: "14px" }}
                />
              </div>
            </div>
            <div
              className="skeleton-badge skeleton-pulse"
              style={{ width: "100px", height: "26px" }}
            />
          </div>

          <div
            className="skeleton-line skeleton-pulse"
            style={{ width: "70%", height: "32px", marginBottom: "1.5rem" }}
          />

          <div className="details-header-actions">
            <div
              className="skeleton-button skeleton-pulse"
              style={{ width: "140px", height: "46px" }}
            />
            <div
              className="skeleton-button skeleton-pulse"
              style={{ width: "160px", height: "46px" }}
            />
          </div>
        </div>

        {/* Skeleton Info Grid */}
        <div className="details-info-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="details-info-pill skeleton-card">
              <div
                className="skeleton-avatar skeleton-pulse"
                style={{ width: "44px", height: "44px" }}
              />
              <div style={{ flex: 1 }}>
                <div
                  className="skeleton-line skeleton-pulse"
                  style={{ width: "60px", height: "12px", marginBottom: "6px" }}
                />
                <div
                  className="skeleton-line skeleton-pulse"
                  style={{ width: "90px", height: "16px" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton Description Card */}
        <div className="details-section-card skeleton-card">
          <div
            className="skeleton-line skeleton-pulse"
            style={{ width: "220px", height: "24px", marginBottom: "1.5rem" }}
          />
          <div
            className="skeleton-line skeleton-pulse"
            style={{ width: "100%", height: "16px", marginBottom: "8px" }}
          />
          <div
            className="skeleton-line skeleton-pulse"
            style={{ width: "95%", height: "16px", marginBottom: "8px" }}
          />
          <div
            className="skeleton-line skeleton-pulse"
            style={{ width: "88%", height: "16px", marginBottom: "8px" }}
          />
          <div
            className="skeleton-line skeleton-pulse"
            style={{ width: "60%", height: "16px" }}
          />
        </div>
      </div>
    );
  }

  // Error / Invalid ID / Not Found State
  if (errorStatus || !opportunity) {
    const isInvalid = errorStatus === 400;
    const isNotFound = errorStatus === 404;

    return (
      <div className="page-container details-page-wrapper">
        <Link to="/" className="details-back-link">
          ← Back to listings
        </Link>
        <EmptyState
          icon={isInvalid ? "🚫" : isNotFound ? "🔍" : "⚠️"}
          title={
            isInvalid
              ? "Invalid Opportunity ID"
              : isNotFound
              ? "Opportunity Not Found"
              : "Unable to Load Opportunity"
          }
          message={
            errorMessage ||
            `The requested opportunity "${id}" could not be located in our database.`
          }
          actionText={
            isInvalid || isNotFound ? "Browse All Opportunities" : "Try Again"
          }
          onAction={isInvalid || isNotFound ? () => window.location.assign("/") : handleRetry}
        />
      </div>
    );
  }

  const badgeVariant = getDomainBadgeVariant(opportunity.domain);
  const initials = getCompanyInitials(opportunity.companyName);
  const oppId = opportunity._id || opportunity.id;

  return (
    <div className="page-container details-page-wrapper">
      {/* Back Link */}
      <div>
        <Link to="/" className="details-back-link">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to listings</span>
        </Link>
      </div>

      {/* 1. Header Card with Title, Company, and Domain Badge */}
      <section className="details-header-card" aria-labelledby="opportunity-title">
        <div className="details-header-top">
          <div className="details-company-avatar-group">
            <div className={`details-avatar avatar-${badgeVariant}`}>
              {initials}
            </div>
            <div className="details-company-title-wrap">
              <span className="details-company-name">{opportunity.companyName}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Verified Listing • {opportunity.domain}
              </span>
            </div>
          </div>

          <Badge
            variant={badgeVariant}
            style={{ fontSize: "0.85rem", padding: "0.4rem 1rem" }}
          >
            {opportunity.domain}
          </Badge>
        </div>

        <h1 id="opportunity-title" className="details-main-title">
          {opportunity.title}
        </h1>

        <div className="details-header-actions">
          <Link to={`/apply/${oppId}`} className="btn btn-primary btn-apply-primary">
            Apply Now
            <svg
              width="18"
              height="18"
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

          {opportunity.applicationLink && (
            <a
              href={opportunity.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              title="Open external company application page"
            >
              <span>External Page</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </section>

      {/* 2. Info Row with Icons for Location, Experience, Domain */}
      <section className="details-info-grid" aria-label="Key Opportunity Information">
        <div className="details-info-pill">
          <div className="details-pill-icon" role="img" aria-label="location">
            📍
          </div>
          <div className="details-pill-content">
            <span className="details-pill-label">Location</span>
            <span className="details-pill-value">{opportunity.location || "Remote"}</span>
          </div>
        </div>

        <div className="details-info-pill">
          <div className="details-pill-icon" role="img" aria-label="experience">
            💼
          </div>
          <div className="details-pill-content">
            <span className="details-pill-label">Experience Level</span>
            <span className="details-pill-value">
              {opportunity.experience || "Fresher"}
            </span>
          </div>
        </div>

        <div className="details-info-pill">
          <div className="details-pill-icon" role="img" aria-label="domain">
            🏷️
          </div>
          <div className="details-pill-content">
            <span className="details-pill-label">Domain</span>
            <span className="details-pill-value">{opportunity.domain}</span>
          </div>
        </div>

        <div className="details-info-pill">
          <div className="details-pill-icon" role="img" aria-label="company">
            🏢
          </div>
          <div className="details-pill-content">
            <span className="details-pill-label">Hiring Company</span>
            <span className="details-pill-value">{opportunity.companyName}</span>
          </div>
        </div>
      </section>

      {/* 3. Description Section */}
      <section className="details-section-card" aria-label="Job Description">
        <h2 className="details-section-title">
          <span role="img" aria-label="document">
            📄
          </span>
          <span>Role Description & Responsibilities</span>
        </h2>
        <div className="details-description-body">{opportunity.description}</div>
      </section>

      {/* 4. Application Link Section */}
      {opportunity.applicationLink && (
        <section className="details-link-card" aria-label="Official Application Link">
          <h3 className="details-link-header">
            🔗 Company Career Page / Application Link
          </h3>
          <p className="details-link-desc">
            Direct verified link to {opportunity.companyName}&apos;s application portal:
          </p>

          <div className="details-link-box">
            <span className="details-url-text">{opportunity.applicationLink}</span>
            <a
              href={opportunity.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-visit-external"
            >
              <span>Visit Link</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </section>
      )}

      {/* 5. Bottom Call to Action Card */}
      <section className="details-bottom-cta">
        <h3>Ready to take the next step?</h3>
        <p>
          Submit your candidate application directly through InternHub in seconds.
        </p>
        <div className="details-bottom-cta-actions">
          <Link
            to={`/apply/${oppId}`}
            className="btn btn-primary btn-apply-primary"
          >
            Apply Now (/apply/{oppId})
          </Link>
          <Link to="/" className="btn btn-secondary">
            Browse More Listings
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OpportunityDetails;
