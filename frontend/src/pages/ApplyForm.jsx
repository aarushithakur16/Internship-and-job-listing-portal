import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Toast from "../components/Toast";
import API from "../services/api";

const ApplyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Opportunity metadata
  const [opportunity, setOpportunity] = useState(null);
  const [loadingOpp, setLoadingOpp] = useState(true);

  // Form input state
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    resumeLink: "",
  });

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

  // Fetch selected opportunity to display title and company
  useEffect(() => {
    let isMounted = true;

    const fetchOpp = async () => {
      try {
        const res = await API.get(`/opportunities/${id}`);
        if (isMounted && res.data) {
          setOpportunity(res.data);
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Could not fetch opportunity details for banner:", err);
        }
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

    // 4. Resume Link: optional, but if provided must be valid URL
    if (values.resumeLink && values.resumeLink.trim()) {
      const urlRegex = /^https?:\/\/.+/i;
      if (!urlRegex.test(values.resumeLink.trim())) {
        errs.resumeLink = "Resume link must be a valid URL starting with http:// or https://";
      }
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate field if it was already touched
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

    // Mark all as touched
    setTouched({
      applicantName: true,
      email: true,
      phone: true,
      resumeLink: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    // If validation fails, halt submission
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        opportunityId: id,
        applicantName: formData.applicantName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        resumeLink: formData.resumeLink.trim(),
      };

      const response = await API.post("/applications", payload);

      if (response.status === 201 || response.status === 200) {
        // ONLY after a successful save redirect to /confirmation
        navigate("/confirmation", {
          state: {
            opportunityTitle: opportunity?.title || "Internship / Job",
            companyName: opportunity?.companyName || "Hiring Partner",
            applicantName: formData.applicantName.trim(),
          },
        });
      } else {
        throw new Error(response.data?.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Application submission error:", err);
      const errorMsg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Unable to reach the server. Please check your backend connection."
          : "An unexpected error occurred while saving your application.");

      // Show error toast if the API fails
      setToast({
        isOpen: true,
        message: errorMsg,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container apply-page-container">
      {/* Toast Notification for API Failures */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Back Link */}
      <div>
        <Link to={`/opportunities/${id}`} className="details-back-link">
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
          <span>Back to Opportunity</span>
        </Link>
      </div>

      {/* Centered Pastel Application Card */}
      <div className="apply-card">
        <div className="apply-header">
          <span
            className="pill-badge"
            style={{ marginBottom: "0.5rem" }}
          >
            🚀 Candidate Application
          </span>
          <h1 className="apply-title">Apply for Position</h1>
          <p className="apply-subtitle">
            Fill in your contact details below to submit your application directly.
          </p>
        </div>

        {/* Selected Opportunity Title & Company Banner */}
        <div className="apply-opportunity-banner">
          <div className="banner-role-info">
            <span className="banner-role-title">
              {loadingOpp
                ? "Loading opportunity..."
                : opportunity?.title || "Candidate Opportunity"}
            </span>
            <span className="banner-company-name">
              {opportunity?.companyName || "Verified Hiring Partner"}
            </span>
          </div>

          {opportunity?.domain && (
            <Badge variant="lavender">{opportunity.domain}</Badge>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* 1. Full Name */}
          <Input
            label="Full Name"
            name="applicantName"
            id="applicantName"
            placeholder="e.g. Aarushi Sharma"
            value={formData.applicantName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.applicantName ? errors.applicantName : ""}
            required
            autoComplete="name"
          />

          {/* 2. Email Address */}
          <Input
            label="Email Address"
            name="email"
            id="email"
            type="email"
            placeholder="e.g. applicant@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ""}
            required
            autoComplete="email"
          />

          {/* 3. Phone Number */}
          <Input
            label="Phone Number"
            name="phone"
            id="phone"
            type="tel"
            placeholder="e.g. +91 9876543210 or (555) 012-3456"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone ? errors.phone : ""}
            required
            autoComplete="tel"
          />

          {/* 4. Resume Link (Optional) */}
          <Input
            label="Resume Link (Optional)"
            name="resumeLink"
            id="resumeLink"
            type="url"
            placeholder="e.g. https://drive.google.com/your-resume or portfolio URL"
            value={formData.resumeLink}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.resumeLink ? errors.resumeLink : ""}
            helperText="Google Drive, Dropbox, Notion, or personal portfolio URL."
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="apply-submit-btn"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting Application..." : "Submit Application ✨"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
