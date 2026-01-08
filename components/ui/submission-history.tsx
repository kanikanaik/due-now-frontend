"use client";

import React, { useState } from "react";
import { SubmissionAttempt } from "@/app/context/AssignmentContext";
import { formatRelativeTime } from "@/lib/assignment-utils";

interface SubmissionHistoryProps {
  attempts: SubmissionAttempt[];
  currentAttempt: number;
  maxAttempts: number;
}

export function SubmissionHistory({
  attempts,
  currentAttempt,
  maxAttempts,
}: SubmissionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (attempts.length === 0) {
    return null;
  }

  const sortedAttempts = [...attempts].sort(
    (a, b) => b.attemptNumber - a.attemptNumber
  );
  const latestAttempt = sortedAttempts[0];
  const remainingAttempts = maxAttempts - currentAttempt;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-indigo-600"
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
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              Submission History
            </p>
            <p className="text-xs text-gray-500">
              {attempts.length} attempt{attempts.length > 1 ? "s" : ""} •
              {remainingAttempts > 0
                ? ` ${remainingAttempts} remaining`
                : " No attempts remaining"}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Latest submission preview */}
      {!isExpanded && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              Latest
            </span>
            <span>Attempt #{latestAttempt.attemptNumber}</span>
            <span>•</span>
            <span>{formatRelativeTime(latestAttempt.submittedAt)}</span>
          </div>
        </div>
      )}

      {/* Expanded history */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="p-4 space-y-3">
            {sortedAttempts.map((attempt, index) => (
              <div
                key={attempt.attemptNumber}
                className={`
                  flex items-start gap-3 p-3 rounded-lg
                  ${
                    index === 0
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50"
                  }
                `}
              >
                <div
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${
                    index === 0
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }
                `}
                >
                  {attempt.attemptNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      Attempt #{attempt.attemptNumber}
                    </span>
                    {index === 0 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Submitted {formatRelativeTime(attempt.submittedAt)}
                  </p>
                  {attempt.textContent && (
                    <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                      {attempt.textContent}
                    </p>
                  )}
                  {attempt.fileUrl && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-600">
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
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      File attached
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
