import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-badge">⚡</span>
          <span className="brand-text">InternFlow</span>
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Explore Opportunities
          </Link>
          <div className="nav-divider" />
          <Link
            to="/admin"
            className={`nav-link ${isActive("/admin") ? "active" : ""}`}
          >
            Admin Management
          </Link>
          <Link
            to="/admin/applications"
            className={`nav-link ${
              isActive("/admin/applications") ? "active" : ""
            }`}
          >
            View Applications
          </Link>
          <div className="nav-divider" />
          <Link
            to="/design-preview"
            className={`nav-link ${
              isActive("/design-preview") ? "active" : ""
            }`}
            style={{ color: "var(--primary)", fontWeight: "600" }}
          >
            🎨 Design Preview
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
