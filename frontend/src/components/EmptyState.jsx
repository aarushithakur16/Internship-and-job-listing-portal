import React from "react";
import Button from "./Button";

const EmptyState = ({
  icon = "📁",
  title = "No results found",
  message = "Try adjusting your search criteria or filters.",
  actionText,
  onAction,
  className = "",
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
