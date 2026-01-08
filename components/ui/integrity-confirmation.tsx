"use client";

import React, { useState } from "react";

interface IntegrityConfirmationProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function IntegrityConfirmation({
  isChecked,
  onChange,
  disabled = false,
}: IntegrityConfirmationProps) {
  return (
    <div
      className={`
      border rounded-lg p-4 transition-colors
      ${
        isChecked
          ? "border-green-200 bg-green-50/50"
          : "border-amber-200 bg-amber-50/50"
      }
      ${disabled ? "opacity-60 cursor-not-allowed" : ""}
    `}
    >
      <label
        className={`flex items-start gap-3 ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={`
              w-5 h-5 rounded border-2 text-green-600 
              focus:ring-green-500 focus:ring-offset-0
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 mb-1">
            Academic Integrity Confirmation
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            I confirm that this submission is my own original work. I have not
            plagiarized or copied from any unauthorized sources, and I have
            properly cited all references used.
          </p>
        </div>
      </label>
    </div>
  );
}

interface SubmissionLockNoticeProps {
  dueDate: string;
  allowLateSubmission: boolean;
}

export function SubmissionLockNotice({
  dueDate,
  allowLateSubmission,
}: SubmissionLockNoticeProps) {
  const isLocked = new Date(dueDate) < new Date() && !allowLateSubmission;

  if (!isLocked) return null;

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-gray-500"
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
        </div>
        <div>
          <p className="font-medium text-gray-900">Submissions Locked</p>
          <p className="text-sm text-gray-500">
            The deadline has passed and late submissions are not accepted for
            this assignment.
          </p>
        </div>
      </div>
    </div>
  );
}
