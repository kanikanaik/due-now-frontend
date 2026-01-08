"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssignments } from "@/app/context/AssignmentContext";
import { useAuth } from "@/app/context/AuthContext";
import { Card, Badge, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { GradingPanel } from "@/components/ui/grading-panel";
import { GradeStatusBadge } from "@/components/ui/grade-badge";
import { FileText, Calendar, User, Eye, Award } from "lucide-react";

export default function TeacherSubmissionsPage() {
  const { user } = useAuth();
  const { assignments, submissions, addGrade, publishGrade } = useAssignments();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");

  // Get all submissions (teacher can see all)
  const allSubmissions = submissions.filter((sub) => {
    const assignment = assignments.find((a) => a.id === sub.assignmentId);
    return assignment?.teacherId === user?.id;
  });

  // Filter submissions
  const filteredSubmissions = allSubmissions.filter((sub) => {
    if (filter === "pending") return !sub.grade || sub.grade.status === "not-graded";
    if (filter === "graded") return sub.grade && sub.grade.status !== "not-graded";
    return true;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedSubmissionData = selectedSubmission
    ? submissions.find((s) => s.id === selectedSubmission)
    : null;

  const selectedAssignment = selectedSubmissionData
    ? assignments.find((a) => a.id === selectedSubmissionData.assignmentId)
    : null;

  const handleGradeSubmission = (grade: any) => {
    if (selectedSubmission) {
      addGrade(selectedSubmission, grade);
      setSelectedSubmission(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#111827]">
          Student Submissions
        </h1>
        <p className="text-[#6B7280] mt-1">
          Review and grade submissions from your students
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "graded"] as const).map((f) => (
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
            <span className="ml-2 text-xs opacity-75">
              ({f === "all" ? allSubmissions.length : 
                f === "pending" ? allSubmissions.filter(s => !s.grade || s.grade.status === "not-graded").length :
                allSubmissions.filter(s => s.grade && s.grade.status !== "not-graded").length})
            </span>
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="text-lg font-medium text-[#111827] mb-2">
            No submissions found
          </h3>
          <p className="text-[#6B7280]">
            {filter === "pending" 
              ? "All submissions have been graded" 
              : filter === "graded"
              ? "No graded submissions yet"
              : "No student submissions yet"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => {
            const assignment = assignments.find(
              (a) => a.id === submission.assignmentId
            );
            const isLate = assignment && new Date(submission.submittedAt) > new Date(assignment.dueDate);

            return (
              <Card key={submission.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Assignment Title & Student */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#111827] mb-1">
                          {assignment?.title || "Unknown Assignment"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{submission.studentName}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isLate && (
                          <Badge variant="warning">Late Submission</Badge>
                        )}
                        {submission.grade && (
                          <GradeStatusBadge status={submission.grade.status} />
                        )}
                      </div>
                    </div>

                    {/* Submission Content Preview */}
                    {submission.textContent && (
                      <div className="bg-[#F9FAFB] rounded-lg p-4 mb-3">
                        <p className="text-sm text-[#6B7280] line-clamp-3">
                          {submission.textContent}
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#9CA3AF]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Submitted: {formatDate(submission.submittedAt)}
                      </span>
                      {submission.fileUrl && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          File attached
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        Attempt {submission.currentAttempt} of {assignment?.maxAttempts || 1}
                      </span>
                      {submission.grade?.letterGrade && (
                        <span className="flex items-center gap-1 font-semibold text-[#6366F1]">
                          <Award className="w-4 h-4" />
                          Grade: {submission.grade.letterGrade}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSubmission(submission.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {submission.grade ? "View & Edit Grade" : "Grade Submission"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Grading Dialog */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Grade Submission - {selectedAssignment?.title}
            </DialogTitle>
            <p className="text-sm text-[#6B7280]">
              Student: {selectedSubmissionData?.studentName}
            </p>
          </DialogHeader>

          {selectedSubmissionData && (
            <div className="space-y-6">
              {/* Submission Content */}
              <div>
                <h4 className="text-sm font-medium text-[#111827] mb-2">
                  Student Submission
                </h4>
                <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                  {selectedSubmissionData.textContent && (
                    <p className="text-sm text-[#374151] whitespace-pre-wrap">
                      {selectedSubmissionData.textContent}
                    </p>
                  )}
                  {selectedSubmissionData.fileUrl && (
                    <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                      <a
                        href={selectedSubmissionData.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#6366F1] hover:underline flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View attached file
                      </a>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2">
                  Submitted: {formatDate(selectedSubmissionData.submittedAt)}
                </p>
              </div>

              {/* Grading Panel */}
              <GradingPanel
                submissionId={selectedSubmissionData.id}
                teacherId={user?.id || ""}
                teacherName={user?.name || ""}
                existingGrade={selectedSubmissionData.grade}
                assignmentRubric={selectedAssignment?.rubric}
                onSaveGrade={handleGradeSubmission}
                onPublishGrade={publishGrade}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
