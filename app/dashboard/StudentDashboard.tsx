"use client";

import React from "react";
import Link from "next/link";
import { useAssignments } from "@/app/context/AssignmentContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  Card,
  Badge,
  ProgressSnapshot,
  WeeklyWorkload,
  AnnouncementList,
  DeadlineBadge,
  PriorityBadge,
  DifficultyBadge,
  StatusBadge,
} from "@/components/ui";
import { getDeadlineInfo } from "@/lib/assignment-utils";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { assignments, getStudentSubmissions, announcements, dismissAnnouncement } = useAssignments();

  const studentSubmissions = getStudentSubmissions(user?.id || "");
  const submittedAssignmentIds = studentSubmissions.map((s) => s.assignmentId);

  // Get submission status for each assignment
  const getSubmissionStatus = (assignmentId: string) => {
    const submission = studentSubmissions.find(
      (s) => s.assignmentId === assignmentId
    );
    if (submission) return submission.status === "late" ? "late" : "submitted";

    const assignment = assignments.find((a) => a.id === assignmentId);
    if (assignment && new Date(assignment.dueDate) < new Date())
      return "overdue";

    return "pending";
  };

  // Filter only published assignments for students
  const visibleAssignments = assignments.filter(
    (a) => a.status === "published" || a.status === "closed"
  );

  // Stats
  const totalAssignments = visibleAssignments.length;
  const submittedCount = studentSubmissions.length;
  const pendingAssignments = visibleAssignments.filter(
    (a) =>
      !studentSubmissions.find((s) => s.assignmentId === a.id) &&
      new Date(a.dueDate) >= new Date()
  );
  const pendingCount = pendingAssignments.length;
  const overdueCount = visibleAssignments.filter(
    (a) =>
      !studentSubmissions.find((s) => s.assignmentId === a.id) &&
      new Date(a.dueDate) < new Date()
  ).length;

  // Filter global announcements
  const globalAnnouncements = announcements.filter((a) => a.type === "global");

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
      case "late":
        return <Badge variant="warning">Late</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="pending">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#111827]">
          My Assignments
        </h1>
        <p className="text-[#6B7280] mt-1">View and submit your assignments</p>
      </div>

      {/* Announcements */}
      {globalAnnouncements.length > 0 && (
        <div className="mb-6">
          <AnnouncementList
            announcements={globalAnnouncements}
            onDismiss={dismissAnnouncement}
            maxItems={3}
          />
        </div>
      )}

      {/* Progress Snapshot */}
      <div className="mb-6">
        <ProgressSnapshot
          total={totalAssignments}
          submitted={submittedCount}
          pending={pendingCount}
          overdue={overdueCount}
        />
      </div>

      {/* Weekly Workload Preview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">
          Upcoming Deadlines
        </h2>
        <WeeklyWorkload
          assignments={visibleAssignments}
          studentSubmissions={submittedAssignmentIds}
        />
      </div>

      {/* All Assignments Section */}
      <h2 className="text-lg font-semibold text-[#111827] mb-4">
        All Assignments
      </h2>

      {/* Assignments Grid */}
      {visibleAssignments.length === 0 ? (
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
            All caught up!
          </h3>
          <p className="text-[#6B7280]">Check back later for new assignments</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleAssignments.map((assignment) => {
            const status = getSubmissionStatus(assignment.id);
            const deadlineInfo = getDeadlineInfo(assignment.dueDate);
            const isOverdue = status === "overdue";
            const hasSubmitted = status === "submitted" || status === "late";

            return (
              <Link
                key={assignment.id}
                href={`/dashboard/assignments/${assignment.id}`}
              >
                <Card
                  hover
                  className={`h-full transition-all ${
                    isOverdue
                      ? "border-red-200 bg-red-50/30"
                      : deadlineInfo.urgency === "urgent"
                      ? "border-amber-200 bg-amber-50/20"
                      : deadlineInfo.urgency === "warning"
                      ? "border-yellow-200 bg-yellow-50/10"
                      : ""
                  }`}
                >
                  {/* Header with status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#111827] mb-1 line-clamp-1">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        by {assignment.teacherName}
                      </p>
                    </div>
                    {getStatusBadge(status)}
                  </div>

                  {/* Priority & Difficulty badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <PriorityBadge priority={assignment.priority} />
                    <DifficultyBadge difficulty={assignment.difficulty} />
                    {assignment.status === "closed" && (
                      <StatusBadge status="closed" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">
                    {assignment.description}
                  </p>

                  {/* Footer with deadline */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
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
                      <span>{formatDate(assignment.dueDate)}</span>
                    </div>
                    {!hasSubmitted && (
                      <DeadlineBadge dueDate={assignment.dueDate} />
                    )}
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
