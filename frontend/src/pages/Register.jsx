import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await register(
      formData.name.trim(),
      formData.email.trim().toLowerCase(),
      formData.password
    );

    setLoading(false);

    if (res.success) {
      navigate(redirectUrl, { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container" style={{ padding: "48px 16px", maxWidth: "460px" }}>
      <div className="card" style={{ padding: "36px 32px", borderRadius: "20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "var(--pastel-lavender-soft)",
              color: "var(--primary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "24px",
            }}
          >
            ✨
          </div>
          <h1 style={{ fontSize: "24px", color: "var(--text-primary)", marginBottom: "8px" }}>
            Create an Account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Join InternHub to apply for top internships and track opportunities
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "var(--pastel-pink-soft)",
              color: "#9F1239",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "20px",
              border: "1px solid #FECDD3",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  display: "flex",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  display: "flex",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m4 4 16 0c1.1 0 2 .9 2 2l0 12c0 1.1-.9 2-2 2l-16 0c-1.1 0-2-.9-2-2l0-12c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  display: "flex",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  display: "flex",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "15px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderRadius: "10px",
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {/* Footer info */}
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
              style={{ color: "var(--primary-color)", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
