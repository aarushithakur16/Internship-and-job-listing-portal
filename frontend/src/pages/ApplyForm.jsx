import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Toast from "../components/Toast";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const ApplyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Opportunity metadata
  const [opportunity, setOpportunity] = useState(null);
  const [loadingOpp, setLoadingOpp] = useState(true);

  // Form input state
  const [formData, setFormData] = useState({
    applicantName: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  // Resume file state
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState("");

  // Inline errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state for API errors
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });

  // If user state updates after load, populate name and email
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        applicantName: prev.applicantName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Fetch selected opportunity to display title and company
  useEffect(() => {
    let isMounted = true;

    const fetchOpp = async () => {
      try {
        const res = await API.get(`/opportunities/${id}`);
        if (isMounted && res.data) {
          setOpportunity(res.data);
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) {
          setLoadingOpp(false);
        }
      }
    };

    fetchOpp();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Validation function
  const validate = (values) => {
    const errs = {};

    // 1. Full Name: required, at least 2 chars
    if (!values.applicantName || !values.applicantName.trim()) {
      errs.applicantName = "Full name is required.";
    } else if (values.applicantName.trim().length < 2) {
      errs.applicantName = "Name must be at least 2 characters.";
    }

    // 2. Email: required, valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email || !values.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(values.email.trim())) {
      errs.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    // 3. Phone: required, valid phone format (at least 7 digits)
    const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
    const digitsOnly = values.phone ? values.phone.replace(/\D/g, "") : "";
    if (!values.phone || !values.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!phoneRegex.test(values.phone.trim()) || digitsOnly.length < 7) {
      errs.phone = "Please enter a valid phone number with at least 7 digits.";
    }

    return errs;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = [".pdf", ".doc", ".docx"];
    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (!allowed.includes(ext)) {
      setFileError("Only PDF or Word documents (.pdf, .doc, .docx) are allowed.");
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit.");
      setResumeFile(null);
      return;
    }

    setFileError("");
    setResumeFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setFileError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name] || "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: newErrors[name] || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      applicantName: true,
      email: true,
      phone: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0 || fileError) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build multipart/form-data payload
      const formPayload = new FormData();
      formPayload.append("opportunityId", id);
      formPayload.append("applicantName", formData.applicantName.trim());
      formPayload.append("email", formData.email.trim());
      formPayload.append("phone", formData.phone.trim());

      if (resumeFile) {
        formPayload.append("resume", resumeFile);
      }

      const response = await API.post("/applications", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/confirmation", {
          state: {
            applicantName: formData.applicantName.trim(),
            email: formData.email.trim(),
            opportunityTitle: opportunity?.title || "Opportunity",
            companyName: opportunity?.companyName || "Partner Company",
            hasResume: !!resumeFile,
            submittedAt: new Date().toISOString(),
          },
        });
      }
    } catch (err) {
      setToast({
        isOpen: true,
        message:
          err.response?.data?.message ||
          "Failed to submit your application. Please check your network and try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authenticated, show sign-in prompt card
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: "48px 16px", maxWidth: "560px" }}>
        <div
          className="card"
          style={{
            padding: "40px 32px",
            textAlign: "center",
            borderRadius: "20px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--pastel-lavender-soft)",
              color: "var(--primary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 style={{ fontSize: "22px", color: "var(--text-primary)", marginBottom: "12px" }}>
            Sign In Required to Apply
          </h2>

          <p
            style={{
              fontSize: "15px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "28px",
            }}
          >
            Please log in or create an account to submit your application for{" "}
            <strong>{opportunity ? opportunity.title : "this opportunity"}</strong>. Your application
            will be tied to your profile.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              to={`/login?redirect=${encodeURIComponent(`/apply/${id}`)}`}
              className="btn btn-primary"
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "15px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Log In to Apply
            </Link>

            <Link
              to={`/register?redirect=${encodeURIComponent(`/apply/${id}`)}`}
              className="btn btn-secondary"
              style={{ padding: "12px", fontSize: "15px" }}
            >
              Create New Account
            </Link>
          </div>

          <div style={{ marginTop: "24px" }}>
            <Link
              to={`/opportunities/${id}`}
              style={{ fontSize: "13px", color: "var(--text-muted)" }}
            >
              ← Return to Opportunity Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 16px", maxWidth: "640px" }}>
      {/* Back Link */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          to={`/opportunities/${id}`}
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 500,
          }}
        >
          ← Back to Opportunity
        </Link>
      </div>

      <div
        className="card"
        style={{
          padding: "36px 32px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Selected Opportunity Header Banner */}
        <div
          style={{
            background: "var(--surface-color)",
            border: "1px solid var(--border-color)",
            borderRadius: "14px",
            padding: "18px 20px",
            marginBottom: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--text-muted)",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              Applying For
            </div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 4px 0",
              }}
            >
              {loadingOpp ? "Loading opportunity..." : opportunity?.title || "Job Opportunity"}
            </h2>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
              {opportunity?.companyName}
            </div>
          </div>

          {opportunity?.domain && (
            <Badge variant="lavender" size="sm">
              {opportunity.domain}
            </Badge>
          )}
        </div>

        {/* Form Title */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Candidate Application
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
            Fill out your details below. You will receive an email confirmation upon submission.
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <Input
            label="Full Name"
            name="applicantName"
            id="applicantName"
            placeholder="e.g. Alex Morgan"
            value={formData.applicantName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.applicantName ? errors.applicantName : ""}
            required
          />

          {/* Email */}
          <Input
            label="Email Address"
            name="email"
            id="email"
            type="email"
            placeholder="e.g. alex.morgan@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ""}
            required
          />

          {/* Phone */}
          <Input
            label="Phone Number"
            name="phone"
            id="phone"
            type="tel"
            placeholder="e.g. +1 555 123 4567"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone ? errors.phone : ""}
            required
          />

          {/* Resume Upload (Multer) */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              Resume File (.pdf, .doc, .docx)
            </label>

            {!resumeFile ? (
              <div
                style={{
                  border: "2px dashed var(--border-color)",
                  borderRadius: "12px",
                  padding: "24px 16px",
                  textAlign: "center",
                  background: "var(--surface-color)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "border-color 0.2s ease",
                }}
              >
                <input
                  type="file"
                  id="resumeUpload"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary-color)", marginBottom: "8px" }}>
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                  Click or drag your resume here to upload
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Supported formats: PDF, Word (.doc, .docx) — Max 5MB
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "var(--pastel-lavender-soft)",
                  borderRadius: "12px",
                  border: "1px solid #DDD6FE",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary-color)" }}>
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {resumeFile.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready to submit
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: "4px",
                  }}
                  title="Remove file"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            {fileError && (
              <div style={{ fontSize: "12px", color: "#E11D48", marginTop: "6px" }}>
                {fileError}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div style={{ marginTop: "32px" }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>

      {/* Error Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ApplyForm;
