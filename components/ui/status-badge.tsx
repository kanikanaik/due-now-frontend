"use client";

import React from "react";
import { AssignmentStatus, getStatusConfig } from "@/lib/assignment-utils";
import { Badge } from "./badge";

interface StatusBadgeProps {
  status: AssignmentStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

// Specific badge for submission locked state
export function LockedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        bg-gray-100 text-gray-600 border border-gray-200
        ${className}
      `}
    >
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
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      Submission Locked
    </span>
  );
}

// Feedback status badge
interface FeedbackStatusBadgeProps {
  status: "reviewed" | "needs-improvement" | "pending";
  className?: string;
}

export function FeedbackStatusBadge({
  status,
  className = "",
}: FeedbackStatusBadgeProps) {
  const configs = {
    reviewed: {
      label: "Reviewed",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    "needs-improvement": {
      label: "Needs Improvement",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
    },
    pending: {
      label: "Pending Review",
      className: "bg-gray-100 text-gray-600 border border-gray-200",
    },
  };

  const config = configs[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.className}
        ${className}
      `}
    >
      {status === "reviewed" && (
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      {status === "needs-improvement" && (
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      )}
      {status === "pending" && (
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
      {config.label}
    </span>
  );
}
