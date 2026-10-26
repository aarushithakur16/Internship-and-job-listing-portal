import React, { useEffect } from "react";

const Toast = ({
  isOpen,
  message,
  type = "success",
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: "✨",
    error: "⚠️",
    info: "💡",
  };

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{icons[type] || "🔔"}</span>
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
