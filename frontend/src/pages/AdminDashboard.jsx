import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import API from "../services/api";

const DOMAIN_OPTIONS = [
  "Web Development",
  "Data Science",
  "Design",
  "Marketing",
  "Cloud Computing",
  "Product Management",
];

const getDomainBadgeVariant = (domain = "") => {
  const d = domain.toLowerCase();
  if (d.includes("soft") || d.includes("dev") || d.includes("web") || d.includes("front") || d.includes("back")) {
    return "mint";
  }
  if (d.includes("design") || d.includes("ui") || d.includes("ux")) {
    return "rose";
  }
  if (d.includes("data") || d.includes("ai") || d.includes("ml") || d.includes("cloud")) {
    return "sky";
  }
  if (d.includes("market") || d.includes("content") || d.includes("growth")) {
    return "peach";
  }
  return "lavender";
};

const initialFormData = {
  title: "",
  companyName: "",
  domain: "Web Development",
  location: "",
  experience: "",
  description: "",
  applicationLink: "",
};

const AdminDashboard = () => {
  // Navigation tab state: 'dashboard' | 'opportunities' | 'applications'
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means "Add" mode
  const [deletingOpportunity, setDeletingOpportunity] = useState(null);

  // Form input and validation states
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadAdminData = async () => {
      try {
        const [oppRes, appRes] = await Promise.all([
          API.get("/opportunities"),
          API.get("/applications").catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setOpportunities(Array.isArray(oppRes.data) ? oppRes.data : []);
          setApplications(Array.isArray(appRes.data) ? appRes.data : []);
        }
      } catch {
        if (isMounted) {
          setToast({
            isOpen: true,
            message: "Failed to fetch latest data from the server",
            type: "error",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const triggerRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  // Derived statistics for summary cards
  const totalOpportunities = opportunities.length;
  const totalApplications = applications.length;
  const uniqueDomainsCount = new Set(
    opportunities.map((item) => (item.domain || "").trim().toLowerCase()).filter(Boolean)
  ).size;

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Job / Internship title is required.";
    if (!formData.companyName.trim()) errors.companyName = "Company name is required.";
    if (!formData.domain.trim()) errors.domain = "Domain category is required.";
    if (!formData.location.trim()) errors.location = "Job location is required.";
    if (!formData.experience.trim()) errors.experience = "Experience level is required.";
    if (!formData.description.trim()) errors.description = "Role description is required.";
    if (!formData.applicationLink.trim()) {
      errors.applicationLink = "Application link is required.";
    } else if (!/^https?:\/\/.+/i.test(formData.applicationLink.trim())) {
      errors.applicationLink = "Must be a valid URL starting with http:// or https://";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open "Add Opportunity" Modal
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open "Edit Opportunity" Modal with prefilled values
  const handleOpenEditModal = (opp) => {
    setEditingId(opp._id || opp.id);
    setFormData({
      title: opp.title || "",
      companyName: opp.companyName || "",
      domain: opp.domain || "Web Development",
      location: opp.location || "",
      experience: opp.experience || "",
      description: opp.description || "",
      applicationLink: opp.applicationLink || "",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open "Delete Confirmation" Modal
  const handleOpenDeleteModal = (opp) => {
    setDeletingOpportunity(opp);
    setIsDeleteModalOpen(true);
  };

  // Submit Add / Edit Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        companyName: formData.companyName.trim(),
        domain: formData.domain.trim(),
        location: formData.location.trim(),
        experience: formData.experience.trim(),
        description: formData.description.trim(),
        applicationLink: formData.applicationLink.trim(),
      };

      if (editingId) {
        // Edit existing opportunity
        await API.put(`/opportunities/${editingId}`, payload);
        showToast("Opportunity updated successfully!", "success");
      } else {
        // Create new opportunity
        await API.post("/opportunities", payload);
        showToast("New opportunity created successfully!", "success");
      }

      setIsFormModalOpen(false);
      // Refresh list after action
      triggerRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save opportunity.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingOpportunity) return;
    const oppId = deletingOpportunity._id || deletingOpportunity.id;

    setIsDeleting(true);
    try {
      await API.delete(`/opportunities/${oppId}`);
      showToast("Opportunity deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      setDeletingOpportunity(null);
      // Refresh list after delete
      triggerRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete opportunity.";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Toast Notifications */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 1. Left Sidebar (transforms to top menu on mobile) */}
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
          <button
            type="button"
            className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="admin-nav-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "opportunities" ? "active" : ""}`}
            onClick={() => setActiveTab("opportunities")}
          >
            <span className="admin-nav-icon">💼</span>
            <span>Opportunities</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "applications" ? "active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            <span className="admin-nav-icon">📬</span>
            <span>Applications ({totalApplications})</span>
          </button>

          <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
            <Link to="/" className="admin-nav-item" style={{ fontSize: "0.85rem" }}>
              <span className="admin-nav-icon">🏠</span>
              <span>Public Site</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <main className="admin-main-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <h1>
              {activeTab === "applications"
                ? "Candidate Applications"
                : "Opportunities Management"}
            </h1>
            <p>
              {activeTab === "applications"
                ? "Review applications received from prospective candidates."
                : "Manage and publish internship and job listings across all domains."}
            </p>
          </div>

          {activeTab !== "applications" && (
            <Button
              variant="primary"
              onClick={handleOpenAddModal}
              style={{ boxShadow: "0 4px 14px rgba(139, 92, 246, 0.35)" }}
            >
              <span>+ Add Opportunity</span>
            </Button>
          )}
        </div>

        {/* 3. Three Pastel Summary Cards */}
        <section className="admin-stats-grid" aria-label="Summary Statistics">
          {/* Card 1: Lavender (Total Opportunities) */}
          <div className="pastel-stat-card stat-card-lavender">
            <div className="stat-icon-wrap stat-icon-lavender">💼</div>
            <div className="stat-info">
              <span className="stat-value">
                {loading ? "..." : totalOpportunities}
              </span>
              <span className="stat-label">Total Opportunities</span>
            </div>
          </div>

          {/* Card 2: Mint (Total Applications) */}
          <div className="pastel-stat-card stat-card-mint">
            <div className="stat-icon-wrap stat-icon-mint">📬</div>
            <div className="stat-info">
              <span className="stat-value">
                {loading ? "..." : totalApplications}
              </span>
              <span className="stat-label">Total Applications</span>
            </div>
          </div>

          {/* Card 3: Peach (Number of Domains) */}
          <div className="pastel-stat-card stat-card-peach">
            <div className="stat-icon-wrap stat-icon-peach">🏷️</div>
            <div className="stat-info">
              <span className="stat-value">
                {loading ? "..." : uniqueDomainsCount}
              </span>
              <span className="stat-label">Active Domains</span>
            </div>
          </div>
        </section>

        {/* 4. Tab Views: Opportunities Table OR Applications Table */}
        {activeTab !== "applications" ? (
          /* Opportunities Table Card */
          <div className="admin-card-container">
            <div className="admin-card-header">
              <h2>All Active Opportunities ({opportunities.length})</h2>
              <Button variant="secondary" onClick={handleOpenAddModal}>
                + New Listing
              </Button>
            </div>

            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <Spinner size="lg" />
                <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
                  Loading opportunities from API...
                </p>
              </div>
            ) : opportunities.length === 0 ? (
              <EmptyState
                icon="💼"
                title="No opportunities found"
                message="Get started by creating your first job or internship listing."
                actionText="+ Add Opportunity"
                onAction={handleOpenAddModal}
              />
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Domain</th>
                      <th>Location</th>
                      <th>Experience</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.map((opp) => {
                      const id = opp._id || opp.id;
                      const badgeVariant = getDomainBadgeVariant(opp.domain);

                      return (
                        <tr key={id}>
                          <td className="opportunity-title-cell">
                            <Link
                              to={`/opportunities/${id}`}
                              style={{ textDecoration: "none", color: "inherit" }}
                              title="View opportunity details"
                            >
                              {opp.title}
                            </Link>
                          </td>
                          <td className="opportunity-company-cell">
                            {opp.companyName}
                          </td>
                          <td>
                            <Badge variant={badgeVariant}>{opp.domain}</Badge>
                          </td>
                          <td>
                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                              📍 {opp.location}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                              💼 {opp.experience}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }} className="admin-actions-cell">
                            <div
                              className="admin-action-btn-group"
                              style={{ justifyContent: "flex-end" }}
                            >
                              <button
                                type="button"
                                className="btn-table-edit"
                                onClick={() => handleOpenEditModal(opp)}
                                title="Edit this opportunity"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                className="btn-table-delete"
                                onClick={() => handleOpenDeleteModal(opp)}
                                title="Delete this opportunity"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Applications Table Card */
          <div className="admin-card-container">
            <div className="admin-card-header">
              <h2>Candidate Applications ({applications.length})</h2>
            </div>

            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <Spinner size="lg" />
              </div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon="📬"
                title="No applications submitted yet"
                message="Candidate applications submitted via the portal will appear here."
              />
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role & Company</th>
                      <th>Resume</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id || app.id}>
                        <td style={{ fontWeight: 600 }}>{app.applicantName}</td>
                        <td style={{ color: "var(--primary)" }}>{app.email}</td>
                        <td>{app.phone}</td>
                        <td>
                          <div style={{ fontWeight: 500 }}>
                            {app.opportunityTitle || app.opportunityId?.title || "Applied Role"}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {app.companyName || app.opportunityId?.companyName || ""}
                          </div>
                        </td>
                        <td>
                          {app.resumeLink ? (
                            <a
                              href={app.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}
                            >
                              View Resume ↗
                            </a>
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                              None
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                          {app.submittedAt
                            ? new Date(app.submittedAt).toLocaleDateString()
                            : "Recently"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Add / Edit Opportunity Modal (All 7 Fields) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingId ? "Edit Opportunity" : "Add New Opportunity"}
        className="opportunity-modal"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsFormModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleFormSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {editingId ? "Save Changes" : "Create Opportunity"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div className="opportunity-modal-grid">
            {/* Field 1: Title */}
            <Input
              label="Opportunity Title"
              id="title"
              name="title"
              placeholder="e.g. Frontend Engineer Intern"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={formErrors.title}
              required
            />

            {/* Field 2: Company Name */}
            <Input
              label="Company Name"
              id="companyName"
              name="companyName"
              placeholder="e.g. PixelCraft Studios"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              error={formErrors.companyName}
              required
            />
          </div>

          <div className="opportunity-modal-grid">
            {/* Field 3: Domain */}
            <div className="form-group">
              <label htmlFor="domain" className="form-label">
                Domain Category <span style={{ color: "var(--accent-rose)" }}>*</span>
              </label>
              <select
                id="domain"
                name="domain"
                className={`form-select ${formErrors.domain ? "error" : ""}`}
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {formErrors.domain && (
                <span className="form-error">{formErrors.domain}</span>
              )}
            </div>

            {/* Field 4: Location */}
            <Input
              label="Location"
              id="location"
              name="location"
              placeholder="e.g. Remote, Bangalore, New York"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={formErrors.location}
              required
            />
          </div>

          <div className="opportunity-modal-grid">
            {/* Field 5: Experience */}
            <Input
              label="Experience Level"
              id="experience"
              name="experience"
              placeholder="e.g. Fresher, 0-1 years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              error={formErrors.experience}
              required
            />

            {/* Field 6: Application Link */}
            <Input
              label="Official Application Link"
              id="applicationLink"
              name="applicationLink"
              type="url"
              placeholder="e.g. https://company.com/careers/apply"
              value={formData.applicationLink}
              onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
              error={formErrors.applicationLink}
              required
            />
          </div>

          {/* Field 7: Description */}
          <div className="form-group" style={{ marginBottom: "0.5rem" }}>
            <label htmlFor="description" className="form-label">
              Detailed Description & Responsibilities <span style={{ color: "var(--accent-rose)" }}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${formErrors.description ? "error" : ""}`}
              placeholder="Detail the roles, responsibilities, requirements, and perks for this position..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {formErrors.description && (
              <span className="form-error">{formErrors.description}</span>
            )}
          </div>
        </form>
      </Modal>

      {/* 6. Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Yes, Delete Opportunity
            </Button>
          </>
        }
      >
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              filter: "drop-shadow(0 4px 10px rgba(244, 63, 94, 0.2))",
            }}
          >
            🗑️
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>
            Delete Listing?
          </h3>
          <p style={{ color: "var(--text-body)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Are you sure you want to permanently delete{" "}
            <strong>&quot;{deletingOpportunity?.title}&quot;</strong> at{" "}
            <strong>{deletingOpportunity?.companyName}</strong>?
          </p>
          <p style={{ color: "var(--accent-rose-text)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
            This opportunity will be immediately removed from the live portal.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
