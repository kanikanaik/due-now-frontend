"use client";

import React from "react";
import {
  getPriorityConfig,
  getDifficultyConfig,
  Priority,
  Difficulty,
} from "@/lib/assignment-utils";

interface PriorityBadgeProps {
  priority: Priority;
  compact?: boolean;
  className?: string;
}

export function PriorityBadge({
  priority,
  compact = false,
  className = "",
}: PriorityBadgeProps) {
  const config = getPriorityConfig(priority);

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${config.className}
        ${className}
      `}
    >
      {!compact && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          {priority === "high" && (
            <path d="M12 2L4 20h16L12 2zm0 4l5.5 11h-11L12 6z" />
          )}
          {priority === "medium" && <circle cx="12" cy="12" r="8" />}
          {priority === "low" && (
            <path d="M12 22L4 4h16L12 22zm0-4l-5.5-11h11L12 18z" />
          )}
        </svg>
      )}
      {compact ? priority.charAt(0).toUpperCase() : config.label}
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  compact?: boolean;
  className?: string;
}

export function DifficultyBadge({
  difficulty,
  compact = false,
  className = "",
}: DifficultyBadgeProps) {
  const config = getDifficultyConfig(difficulty);

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${config.className}
        ${className}
      `}
    >
      {!compact && (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      )}
      {config.label}
    </span>
  );
}
