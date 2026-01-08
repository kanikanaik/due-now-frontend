"use client";

import React from "react";
import { getDeadlineInfo, getUrgencyClasses } from "@/lib/assignment-utils";

interface DeadlineBadgeProps {
  dueDate: string;
  className?: string;
  showIcon?: boolean;
}

export function DeadlineBadge({
  dueDate,
  className = "",
  showIcon = true,
}: DeadlineBadgeProps) {
  const deadlineInfo = getDeadlineInfo(dueDate);
  const urgencyClasses = getUrgencyClasses(deadlineInfo.urgency);

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${urgencyClasses.bg} ${urgencyClasses.text} border ${urgencyClasses.border}
        ${className}
      `}
    >
      {showIcon && (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      {deadlineInfo.label}
    </div>
  );
}
