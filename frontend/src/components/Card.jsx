import React from "react";

const Card = ({
  children,
  interactive = false,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`card ${interactive ? "card-interactive" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
