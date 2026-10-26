import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-badge" role="img" aria-label="sparkles">
            ✨
          </span>
          <span className="brand-text">InternHub</span>
        </Link>

        <div className="navbar-links" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/admin"
            className={`nav-link ${isActive("/admin") ? "active" : ""}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin
          </Link>

          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: isAdmin ? "var(--pastel-peach-soft)" : "var(--pastel-lavender-soft)",
                  padding: "4px 10px 4px 6px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isAdmin ? "#C2410C" : "var(--primary-color)",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span>{user.name.split(" ")[0]}</span>
                {isAdmin && (
                  <span
                    style={{
                      background: "#EA580C",
                      color: "white",
                      fontSize: "10px",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Admin
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{
                  padding: "6px 12px",
                  fontSize: "13px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                title="Log Out"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{
                  padding: "6px 14px",
                  fontSize: "13px",
                }}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
