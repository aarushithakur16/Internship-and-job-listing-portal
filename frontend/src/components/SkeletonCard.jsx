import React from "react";
import Card from "./Card";

const SkeletonCard = () => {
  return (
    <Card className="opportunity-card skeleton-card">
      <div className="opportunity-card-header">
        <div className="company-info-group">
          <div className="skeleton-avatar skeleton-pulse" />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div className="skeleton-line skeleton-pulse" style={{ width: "90px", height: "14px" }} />
            <div className="skeleton-line skeleton-pulse" style={{ width: "60px", height: "10px" }} />
          </div>
        </div>
        <div className="skeleton-badge skeleton-pulse" style={{ width: "80px", height: "22px", borderRadius: "9999px" }} />
      </div>

      <div className="skeleton-line skeleton-pulse" style={{ width: "85%", height: "20px", marginTop: "1rem", marginBottom: "8px" }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: "55%", height: "20px", marginBottom: "1rem" }} />

      <div className="skeleton-line skeleton-pulse" style={{ width: "100%", height: "12px", marginBottom: "6px" }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: "75%", height: "12px", marginBottom: "1.25rem" }} />

      <div className="opportunity-metadata">
        <div className="skeleton-line skeleton-pulse" style={{ width: "70px", height: "14px" }} />
        <div className="skeleton-line skeleton-pulse" style={{ width: "85px", height: "14px" }} />
      </div>

      <div className="opportunity-card-footer">
        <div className="skeleton-button skeleton-pulse" style={{ width: "100%", height: "40px", borderRadius: "9999px" }} />
      </div>
    </Card>
  );
};

export default SkeletonCard;
