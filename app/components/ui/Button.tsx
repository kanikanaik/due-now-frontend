"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[#6366F1] text-white
      hover:bg-[#5558E8] hover:shadow-md hover:-translate-y-0.5
      focus-visible:ring-[#6366F1]
    `,
    secondary: `
      bg-[#EEF2FF] text-[#6366F1]
      hover:bg-[#E0E7FF] hover:shadow-sm
      focus-visible:ring-[#6366F1]
    `,
    outline: `
      border-2 border-[#E5E7EB] bg-transparent text-[#111827]
      hover:border-[#6366F1] hover:text-[#6366F1]
      focus-visible:ring-[#6366F1]
    `,
    ghost: `
      bg-transparent text-[#6B7280]
      hover:bg-[#F3F4F6] hover:text-[#111827]
      focus-visible:ring-[#6366F1]
    `,
    danger: `
      bg-[#EF4444] text-white
      hover:bg-[#DC2626] hover:shadow-md
      focus-visible:ring-[#EF4444]
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
