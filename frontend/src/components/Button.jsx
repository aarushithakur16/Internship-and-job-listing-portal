import React from "react";
import Spinner from "./Spinner";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
