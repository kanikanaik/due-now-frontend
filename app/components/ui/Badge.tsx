"use client";

import React from "react";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "pending" | "primary";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-[#F3F4F6] text-[#6B7280]",
    success: "bg-[#DCFCE7] text-[#16A34A]",
    warning: "bg-[#FEE2E2] text-[#DC2626]",
    pending: "bg-[#FEF3C7] text-[#D97706]",
    primary: "bg-[#EEF2FF] text-[#6366F1]",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full
        text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
