"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        bg-white rounded-xl border border-[#E5E7EB]
        shadow-sm
        ${
          hover
            ? "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            : ""
        }
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
