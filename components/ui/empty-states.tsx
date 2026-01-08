"use client";

import React from "react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: "assignments" | "submissions" | "feedback" | "success" | "search";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  assignments: (
    <svg
      className="w-10 h-10 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  submissions: (
    <svg
      className="w-10 h-10 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  ),
  feedback: (
    <svg
      className="w-10 h-10 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
      />
    </svg>
  ),
  success: (
    <svg
      className="w-10 h-10 text-green-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  search: (
    <svg
      className="w-10 h-10 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
};

export function EmptyState({
  icon = "assignments",
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icons[icon]}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && <Button onClick={action.onClick}>{action.label}</Button>}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Specific empty states for common scenarios
export function NoAssignmentsEmpty({
  onCreateClick,
}: {
  onCreateClick?: () => void;
}) {
  return (
    <EmptyState
      icon="assignments"
      title="No assignments yet"
      description="Get started by creating your first assignment. Your students are waiting!"
      action={
        onCreateClick
          ? { label: "Create Assignment", onClick: onCreateClick }
          : undefined
      }
    />
  );
}

export function NoSubmissionsEmpty() {
  return (
    <EmptyState
      icon="submissions"
      title="No submissions yet"
      description="Submissions will appear here once students start submitting their work."
    />
  );
}

export function AllCaughtUpEmpty() {
  return (
    <EmptyState
      icon="success"
      title="All caught up!"
      description="Great job! You've completed all your assignments. Check back later for new ones."
    />
  );
}

export function NoSearchResultsEmpty({
  onClearClick,
}: {
  onClearClick?: () => void;
}) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description="Try adjusting your search or filter criteria to find what you're looking for."
      action={
        onClearClick
          ? { label: "Clear Search", onClick: onClearClick }
          : undefined
      }
    />
  );
}
