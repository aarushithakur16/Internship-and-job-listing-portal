import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guard for user-authenticated routes
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

// Guard for admin-only routes
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}&role=admin`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <div className="card" style={{ maxWidth: "480px", margin: "0 auto", padding: "36px" }}>
          <div style={{ fontSize: "42px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ fontSize: "22px", color: "var(--text-primary)", marginBottom: "12px" }}>
            Admin Access Required
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
            You are logged in as a candidate. You need administrator privileges to view this page.
          </p>
          <a href="/login?role=admin" className="btn btn-primary" style={{ width: "100%" }}>
            Log in as Admin
          </a>
        </div>
      </div>
    );
  }

  return children;
};
