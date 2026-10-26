import React from "react";

const Badge = ({
  children,
  variant = "lavender",
  className = "",
  ...props
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
