import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import API from "../services/api";

// Helper to format submission date nicely
const formatSubmissionDate = (dateString) => {
  if (!dateString) return "Recently";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Recently";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
};

// Helper for applicant initials avatar
const getInitials = (name = "") => {
  if (!name.trim()) return "AP";
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      try {
        const [appRes, oppRes] = await Promise.all([
          API.get("/applications"),
          API.get("/opportunities").catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setApplications(Array.isArray(appRes.data) ? appRes.data : []);
          setOpportunitiesCount(Array.isArray(oppRes.data) ? oppRes.data.length : 0);
        }
      } catch {
        // Handled via empty state in UI
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Filter applications by applicant (name, email, phone) or opportunity (title, company)
  const filteredApplications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return applications;

    return applications.filter((app) => {
      const applicantName = (app.applicantName || "").toLowerCase();
      const email = (app.email || "").toLowerCase();
      const phone = (app.phone || "").toLowerCase();
      const oppTitle = (
        app.opportunityTitle ||
        app.opportunityId?.title ||
        ""
      ).toLowerCase();
      const company = (
        app.companyName ||
        app.opportunityId?.companyName ||
        ""
      ).toLowerCase();

      return (
        applicantName.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        oppTitle.includes(q) ||
        company.includes(q)
      );
    });
  }, [applications, searchQuery]);

  return (
    <div className="admin-dashboard-container">
      {/* 1. Sidebar (Consistent pastel layout) */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon" role="img" aria-label="sparkles">
            ✨
          </div>
          <div>
            <div className="admin-brand-title">InternHub</div>
            <span className="admin-brand-badge">Admin Portal</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin Navigation">
          <Link to="/admin" className="admin-nav-item">
            <span className="admin-nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>

          <Link to="/admin" className="admin-nav-item">
            <span className="admin-nav-icon">💼</span>
            <span>Opportunities ({opportunitiesCount})</span>
          </Link>

          <Link to="/admin/applications" className="admin-nav-item active">
            <span className="admin-nav-icon">📬</span>
            <span>Applications ({applications.length})</span>
          </Link>

          <div
            style={{
              marginTop: "auto",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-light)",
            }}
          >
            <Link to="/" className="admin-nav-item" style={{ fontSize: "0.85rem" }}>
              <span className="admin-nav-icon">🏠</span>
              <span>Public Site</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <main className="admin-main-content">
        {/* Header with Title and Quick Refresh */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h1 style={{ margin: 0 }}>Candidate Applications</h1>
              {/* Count Badge */}
              <Badge variant="mint" style={{ fontSize: "0.85rem", padding: "0.35rem 0.9rem" }}>
                {applications.length} {applications.length === 1 ? "Application" : "Applications"}
              </Badge>
            </div>
            <p>
              Review all submitted candidate contact details, resumes, and matched opportunities.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setLoading(true);
                setRefreshKey((k) => k + 1);
              }}
              title="Refresh applications list"
            >
              ↻ Refresh
            </button>
            <Link to="/admin" className="btn btn-primary">
              Manage Opportunities
            </Link>
          </div>
        </div>

        {/* 3. Summary Stats Row */}
        <section className="admin-stats-grid" aria-label="Applications Summary">
          <div className="pastel-stat-card stat-card-mint">
            <div className="stat-icon-wrap stat-icon-mint">📬</div>
            <div className="stat-info">
              <span className="stat-value">{loading ? "..." : applications.length}</span>
              <span className="stat-label">Total Applications Received</span>
            </div>
          </div>

          <div className="pastel-stat-card stat-card-lavender">
            <div className="stat-icon-wrap stat-icon-lavender">💼</div>
            <div className="stat-info">
              <span className="stat-value">{loading ? "..." : opportunitiesCount}</span>
              <span className="stat-label">Active Opportunities</span>
            </div>
          </div>
        </section>

        {/* 4. Table Card with Integrated Search Box and Applications Table */}
        <div className="admin-card-container">
          <div className="admin-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 style={{ margin: 0 }}>Applications Directory</h2>
              {searchQuery && (
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  (Showing {filteredApplications.length} of {applications.length})
                </span>
              )}
            </div>

            {/* Search Box: search by applicant or opportunity */}
            <div className="admin-search-wrapper">
              <span className="admin-search-icon-left" aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by applicant or opportunity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search applications"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="admin-search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "3.5rem", textAlign: "center" }}>
              <Spinner size="lg" />
              <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
                Loading applications from database...
              </p>
            </div>
          ) : applications.length === 0 ? (
            /* Empty state when database has 0 applications */
            <EmptyState
              icon="📬"
              title="No applications yet"
              message="When candidates submit applications for job or internship listings, they will appear here in real time."
            />
          ) : filteredApplications.length === 0 ? (
            /* Empty state when search yields no matches */
            <EmptyState
              icon="🔍"
              title="No applications found"
              message={`No applications matched your search for "${searchQuery}". Try a different name or keyword.`}
              actionText="Clear Search"
              onAction={() => setSearchQuery("")}
            />
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Opportunity Title</th>
                    <th>Company</th>
                    <th>Resume Link</th>
                    <th>Submission Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const id = app._id || app.id;
                    const applicantName = app.applicantName || "Anonymous Applicant";
                    const oppTitle =
                      app.opportunityTitle ||
                      app.opportunityId?.title ||
                      "General Application";
                    const company =
                      app.companyName ||
                      app.opportunityId?.companyName ||
                      "InternHub Partner";

                    return (
                      <tr key={id}>
                        {/* 1. Applicant Name */}
                        <td>
                          <div className="applicant-cell-group">
                            <div className="applicant-avatar-sm">
                              {getInitials(applicantName)}
                            </div>
                            <div className="applicant-name-wrap">
                              <span className="applicant-primary-name">
                                {applicantName}
                              </span>
                              <span className="applicant-sub-tag">Candidate</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Email */}
                        <td>
                          <a
                            href={`mailto:${app.email}`}
                            className="contact-link"
                            title={`Send email to ${app.email}`}
                          >
                            {app.email}
                          </a>
                        </td>

                        {/* 3. Phone */}
                        <td>
                          <a
                            href={`tel:${app.phone}`}
                            className="contact-link"
                            title={`Call ${app.phone}`}
                          >
                            {app.phone}
                          </a>
                        </td>

                        {/* 4. Opportunity Title */}
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                            {oppTitle}
                          </div>
                        </td>

                        {/* 5. Company */}
                        <td>
                          <div style={{ color: "#475569", fontWeight: 500 }}>
                            {company}
                          </div>
                        </td>

                        {/* 6. Resume Link / Download (Clickable) */}
                        <td>
                          {app.resumeLink ? (
                            (() => {
                              const apiBase = API.defaults.baseURL || "http://localhost:5000/api";
                              const serverOrigin = apiBase.replace(/\/api\/?$/, "");
                              const fullResumeUrl = app.resumeLink.startsWith("http")
                                ? app.resumeLink
                                : `${serverOrigin}${app.resumeLink.startsWith("/") ? "" : "/"}${app.resumeLink}`;

                              return (
                                <a
                                  href={fullResumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="resume-pill-link"
                                  title={app.resumeOriginalName ? `Download ${app.resumeOriginalName}` : "Download or view candidate resume"}
                                >
                                  <span>{app.resumeFilePath || app.resumeLink.startsWith("/uploads") ? "Download Resume" : "View Resume"}</span>
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                  </svg>
                                </a>
                              );
                            })()
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                              None provided
                            </span>
                          )}
                        </td>

                        {/* 7. Nicely Formatted Submission Date */}
                        <td>
                          <span className="date-badge">
                            {formatSubmissionDate(app.submittedAt || app.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminApplications;
