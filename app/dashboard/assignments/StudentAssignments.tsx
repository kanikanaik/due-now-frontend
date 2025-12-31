"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssignments } from "@/app/context/AssignmentContext";
import { useAuth } from "@/app/context/AuthContext";
import { Card, Badge } from "@/components/ui";
import { Calendar, ClipboardList } from "lucide-react";

export default function StudentAssignments() {
  const { user } = useAuth();
  const { assignments, getStudentSubmissions } = useAssignments();
  const [filter, setFilter] = useState<
    "all" | "pending" | "submitted" | "overdue"
  >("all");

  const studentSubmissions = getStudentSubmissions(user?.id || "");

  const getSubmissionStatus = (assignmentId: string) => {
    const submission = studentSubmissions.find(
      (s) => s.assignmentId === assignmentId
    );
    if (submission) return "submitted";

    const assignment = assignments.find((a) => a.id === assignmentId);
    if (assignment && new Date(assignment.dueDate) < new Date())
      return "overdue";

    return "pending";
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "all") return true;
    return getSubmissionStatus(a.id) === filter;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="success">Submitted</Badge>;
      case "overdue":
        return <Badge variant="warning">Overdue</Badge>;
      default:
        return <Badge variant="pending">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#111827]">
          All Assignments
        </h1>
        <p className="text-[#6B7280] mt-1">View and submit your assignments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "submitted", "overdue"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                filter === f
                  ? "bg-[#6366F1] text-white"
                  : "bg-white text-[#6B7280] hover:bg-[#F3F4F6] border border-[#E5E7EB]"
              }
            `}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#111827] mb-2">
            No {filter !== "all" ? filter : ""} assignments
          </h3>
          <p className="text-[#6B7280]">
            {filter === "all"
              ? "Check back later for new assignments"
              : `You have no ${filter} assignments`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => {
            const status = getSubmissionStatus(assignment.id);
            const isOverdue = status === "overdue";

            return (
              <Link
                key={assignment.id}
                href={`/dashboard/assignments/${assignment.id}`}
              >
                <Card
                  hover
                  className={`h-full ${isOverdue ? "border-[#FCA5A5]" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-[#111827] line-clamp-1 flex-1">
                      {assignment.title}
                    </h3>
                    {getStatusBadge(status)}
                  </div>

                  <p className="text-sm text-[#6B7280] mb-2">
                    by {assignment.teacherName}
                  </p>

                  <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">
                    {assignment.description}
                  </p>

                  <div
                    className={`flex items-center gap-2 text-sm ${
                      isOverdue ? "text-[#EF4444]" : "text-[#6B7280]"
                    }`}
                  >
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
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
