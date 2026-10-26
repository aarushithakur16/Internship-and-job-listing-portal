import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
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
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/admin"
            className={`nav-link ${isActive("/admin") ? "active" : ""}`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
