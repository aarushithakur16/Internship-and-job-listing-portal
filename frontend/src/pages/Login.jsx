import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";
  const defaultIsAdmin = searchParams.get("role") === "admin" || redirectUrl.startsWith("/admin");

  const [isAdminMode, setIsAdminMode] = useState(defaultIsAdmin);
  const [formData, setFormData] = useState({
    email: defaultIsAdmin ? "admin@internhub.com" : "",
    password: defaultIsAdmin ? "AdminPassword123!" : "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleToggleMode = (admin) => {
    setIsAdminMode(admin);
    if (admin) {
      setFormData({
        email: "admin@internhub.com",
        password: "AdminPassword123!",
      });
    } else {
      setFormData({
        email: "",
        password: "",
      });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await login(formData.email.trim(), formData.password);
    setLoading(false);

    if (res.success) {
      // If admin logged in from /admin, take them to admin
      if (res.user.role === "admin" && redirectUrl === "/") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirectUrl, { replace: true });
      }
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
              background: isAdminMode ? "var(--pastel-peach-soft)" : "var(--pastel-lavender-soft)",
              color: isAdminMode ? "#C2410C" : "var(--primary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            {isAdminMode ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          <h1 style={{ fontSize: "24px", color: "var(--text-primary)", marginBottom: "8px" }}>
            {isAdminMode ? "Admin Portal Login" : "Welcome Back"}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            {isAdminMode
              ? "Sign in with administrator credentials to manage listings"
              : "Log in to your InternHub account to submit applications"}
          </p>
        </div>

        {/* Role Mode Switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--surface-color)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => handleToggleMode(false)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              background: !isAdminMode ? "white" : "transparent",
              color: !isAdminMode ? "var(--primary-color)" : "var(--text-secondary)",
              boxShadow: !isAdminMode ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            Candidate
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode(true)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              background: isAdminMode ? "white" : "transparent",
              color: isAdminMode ? "#C2410C" : "var(--text-secondary)",
              boxShadow: isAdminMode ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            Administrator
          </button>
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
          <div style={{ marginBottom: "18px" }}>
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
                placeholder={isAdminMode ? "admin@internhub.com" : "you@example.com"}
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

          <div style={{ marginBottom: "24px" }}>
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
                placeholder="••••••••"
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
            {loading ? "Signing in..." : "Sign In"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {/* Footer info */}
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px" }}>
          {!isAdminMode ? (
            <p style={{ color: "var(--text-secondary)" }}>
              Don't have an account?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
                style={{ color: "var(--primary-color)", fontWeight: 600 }}
              >
                Sign up free
              </Link>
            </p>
          ) : (
            <div
              style={{
                background: "var(--surface-color)",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              Default Admin: <strong>admin@internhub.com</strong> / <strong>AdminPassword123!</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
