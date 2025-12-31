"use client";

import React from "react";
import Link from "next/link";
import { useAssignments } from "@/app/context/AssignmentContext";
import { useAuth } from "@/app/context/AuthContext";
import { Card, Badge } from "@/components/ui";
import { CheckCircle, Calendar, Paperclip, ClipboardList } from "lucide-react";

export default function SubmissionsPage() {
  const { user } = useAuth();
  const { assignments, getStudentSubmissions } = useAssignments();

  const studentSubmissions = getStudentSubmissions(user?.id || "");

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get assignment details for each submission
  const submissionsWithAssignments = studentSubmissions.map((submission) => {
    const assignment = assignments.find(
      (a) => a.id === submission.assignmentId
    );
    return {
      ...submission,
      assignment,
    };
  });

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#111827]">
          My Submissions
        </h1>
        <p className="text-[#6B7280] mt-1">
          View all your submitted assignments
        </p>
      </div>

      {/* Submissions List */}
      {submissionsWithAssignments.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#9CA3AF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#111827] mb-2">
            No submissions yet
          </h3>
          <p className="text-[#6B7280] mb-4">
            You haven&apos;t submitted any assignments
          </p>
          <Link href="/dashboard/assignments">
            <button className="inline-flex items-center justify-center px-4 py-2.5 bg-[#6366F1] text-white font-medium rounded-lg hover:bg-[#5558E8] transition-all duration-200">
              View Assignments
            </button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissionsWithAssignments.map((submission) => (
            <Link
              key={submission.id}
              href={`/dashboard/assignments/${submission.assignmentId}`}
            >
              <Card hover className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-[#111827]">
                        {submission.assignment?.title || "Unknown Assignment"}
                      </h3>
                      <Badge variant="success">Submitted</Badge>
                    </div>
                    {submission.textContent && (
                      <p className="text-sm text-[#6B7280] line-clamp-2 mb-2">
                        {submission.textContent}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Submitted: {formatDate(submission.submittedAt)}
                      </span>
                      {submission.fileUrl && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
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
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#22C55E]"
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
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
