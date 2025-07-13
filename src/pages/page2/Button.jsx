import React from "react";

export function Button({
  children,
  onClick,
  className = "",
  variant = "default",
  ...props
}) {
  let base =
    "inline-flex items-center justify-center rounded px-4 py-2 font-medium transition";
  let variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-primary text-primary bg-white hover:bg-primary/10",
    ghost: "bg-transparent hover:bg-primary/10",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
