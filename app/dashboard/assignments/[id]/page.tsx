"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAssignments } from "@/app/context/AssignmentContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  Card,
  Badge,
  Button,
  Textarea,
  Label,
  FileUpload,
  Toast,
  StatusBadge,
  DeadlineBadge,
  PriorityBadge,
  DifficultyBadge,
  SubmissionHistory,
  FeedbackPanel,
  IntegrityConfirmation,
  SubmissionLockNotice,
  AssignmentAnnouncements,
  LockedBadge,
  GradingPanel,
  StudentGradeView,
  GradeReviewRequestPanel,
  TeacherReviewRequestList,
} from "@/components/ui";
import { getDeadlineInfo } from "@/lib/assignment-utils";

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const {
    assignments,
    getStudentSubmissions,
    submitAssignment,
    getAssignmentAnnouncements,
    addFeedback,
    addGrade,
    updateGrade,
    publishGrade,
    addGradeReviewRequest,
    respondToReviewRequest,
    gradeReviewRequests,
  } = useAssignments();

  const [submissionText, setSubmissionText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [integrityConfirmed, setIntegrityConfirmed] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const assignmentId = params.id as string;
  const assignment = assignments.find((a) => a.id === assignmentId);

  if (!assignment) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
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
            Assignment not found
          </h3>
          <p className="text-[#6B7280] mb-4">
            This assignment may have been deleted or doesn&apos;t exist
          </p>
          <Button onClick={() => router.push("/dashboard/assignments")}>
            Back to Assignments
          </Button>
        </Card>
      </div>
    );
  }

  const studentSubmissions = getStudentSubmissions(user?.id || "");
  const existingSubmission = studentSubmissions.find(
    (s) => s.assignmentId === assignmentId
  );
  const deadlineInfo = getDeadlineInfo(assignment.dueDate);
  const isOverdue = deadlineInfo.isLocked;
  const hasSubmitted = !!existingSubmission;
  const isLocked =
    isOverdue && !assignment.allowLateSubmission && !hasSubmitted;
  const canSubmit =
    !isLocked &&
    (!hasSubmitted ||
      (existingSubmission &&
        existingSubmission.currentAttempt < assignment.maxAttempts));
  const assignmentAnnouncements = getAssignmentAnnouncements(assignmentId);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!submissionText && !selectedFile) {
      setToast({
        isVisible: true,
        message: "Please provide a submission",
        type: "error",
      });
      return;
    }

    if (!integrityConfirmed) {
      setToast({
        isVisible: true,
        message: "Please confirm academic integrity",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    submitAssignment({
      assignmentId,
      studentId: user?.id || "",
      studentName: user?.name || "",
      textContent: submissionText,
      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
      integrityConfirmed,
    });

    setToast({
      isVisible: true,
      message: "Assignment submitted successfully!",
      type: "success",
    });
    setIsSubmitting(false);
    setSubmissionText("");
    setSelectedFile(null);
    setIntegrityConfirmed(false);
  };

  const handleAddFeedback = (
    content: string,
    status: "reviewed" | "needs-improvement"
  ) => {
    if (existingSubmission) {
      addFeedback(existingSubmission.id, {
        teacherId: user?.id || "",
        teacherName: user?.name || "",
        content,
        status,
      });
      setToast({
        isVisible: true,
        message: "Feedback submitted successfully!",
        type: "success",
      });
    }
  };

  const handleSaveGrade = (grade: any) => {
    if (existingSubmission) {
      if (existingSubmission.grade) {
        updateGrade(existingSubmission.grade.id, grade);
      } else {
        addGrade(existingSubmission.id, grade);
      }
      setToast({
        isVisible: true,
        message: grade.status === 'finalized' 
          ? "Grade published successfully!" 
          : "Grade saved as draft!",
        type: "success",
      });
    }
  };

  const handleGradeReviewRequest = (message: string) => {
    if (existingSubmission?.grade) {
      addGradeReviewRequest({
        gradeId: existingSubmission.grade.id,
        studentId: user?.id || "",
        studentName: user?.name || "",
        message,
      });
      setToast({
        isVisible: true,
        message: "Review request submitted!",
        type: "success",
      });
    }
  };

  const handleRespondToReview = (
    requestId: string,
    status: 'accepted' | 'declined',
    message?: string
  ) => {
    respondToReviewRequest(requestId, { status, message });
    setToast({
      isVisible: true,
      message: `Review request ${status}!`,
      type: "success",
    });
  };

  // Get review requests for current grade
  const currentGradeReviewRequests = existingSubmission?.grade
    ? gradeReviewRequests.filter(r => r.gradeId === existingSubmission.grade?.id)
    : [];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-6 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Assignments
      </button>

      {/* Assignment Details */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[#111827] mb-2">
              {assignment.title}
            </h1>
            <p className="text-[#6B7280]">by {assignment.teacherName}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={assignment.status} />
            {hasSubmitted && existingSubmission?.status === "late" && (
              <Badge variant="warning">Late</Badge>
            )}
            {isLocked && <LockedBadge />}
          </div>
        </div>

        {/* Priority & Difficulty badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <PriorityBadge priority={assignment.priority} />
          <DifficultyBadge difficulty={assignment.difficulty} />
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {assignment.maxAttempts} attempt
            {assignment.maxAttempts !== 1 ? "s" : ""} allowed
          </span>
          {assignment.allowLateSubmission && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              Late submissions allowed
            </span>
          )}
        </div>

        {/* Deadline info */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
              isOverdue ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5"
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
            <span className="font-medium">
              Due: {formatDate(assignment.dueDate)}
            </span>
          </div>
          <DeadlineBadge dueDate={assignment.dueDate} />
        </div>

        {/* Assignment-specific announcements */}
        {assignmentAnnouncements.length > 0 && (
          <div className="mb-6">
            <AssignmentAnnouncements announcements={assignmentAnnouncements} />
          </div>
        )}

        <div className="prose max-w-none">
          <h3 className="text-lg font-medium text-[#111827] mb-3">
            Description
          </h3>
          <p className="text-[#6B7280] whitespace-pre-wrap">
            {assignment.description}
          </p>
        </div>
      </Card>

      {/* Submission Section - Only for Students */}
      {user?.role === "student" && (
        <Card>
          <h2 className="text-lg font-semibold text-[#111827] mb-6">
            {hasSubmitted ? "Your Submission" : "Submit Assignment"}
          </h2>

          {hasSubmitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#DCFCE7] border border-[#86EFAC]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <div>
                    <p className="font-medium text-[#166534]">
                      Submitted Successfully
                    </p>
                    <p className="text-sm text-[#16A34A]">
                      Submitted on {formatDate(existingSubmission.submittedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {existingSubmission.textContent && (
                <div>
                  <p className="text-sm font-medium text-[#6B7280] mb-2">
                    Your Response:
                  </p>
                  <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                    <p className="text-[#111827] whitespace-pre-wrap">
                      {existingSubmission.textContent}
                    </p>
                  </div>
                </div>
              )}

              {existingSubmission.fileUrl && (
                <div>
                  <p className="text-sm font-medium text-[#6B7280] mb-2">
                    Attached File:
                  </p>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#6366F1]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-[#111827]">
                      Submission file attached
                    </span>
                  </div>
                </div>
              )}

              {/* Submission History */}
              {existingSubmission.attemptHistory &&
                existingSubmission.attemptHistory.length > 0 && (
                  <SubmissionHistory
                    attempts={existingSubmission.attemptHistory}
                    currentAttempt={existingSubmission.currentAttempt}
                    maxAttempts={assignment.maxAttempts}
                  />
                )}

              {/* Feedback Panel */}
              <FeedbackPanel feedback={existingSubmission.feedback} />

              {/* Student Grade View */}
              <StudentGradeView
                grade={existingSubmission.grade}
                assignmentTitle={assignment.title}
                submittedAt={existingSubmission.submittedAt}
              />

              {/* Grade Review Request */}
              {existingSubmission.grade?.status === "finalized" && (
                <GradeReviewRequestPanel
                  gradeId={existingSubmission.grade.id}
                  studentId={user?.id || ""}
                  studentName={user?.name || ""}
                  existingRequest={currentGradeReviewRequests[0]}
                  onSubmitRequest={handleGradeReviewRequest}
                />
              )}

              {/* Resubmit option */}
              {canSubmit &&
                existingSubmission.currentAttempt < assignment.maxAttempts && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Resubmit Assignment
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        (
                        {assignment.maxAttempts -
                          existingSubmission.currentAttempt}{" "}
                        attempts remaining)
                      </span>
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resubmit-response">
                          Updated Response
                        </Label>
                        <Textarea
                          id="resubmit-response"
                          placeholder="Write your updated answer here..."
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          className="min-h-[120px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Attach File (Optional)
                        </label>
                        <FileUpload
                          onFileSelect={(file) => setSelectedFile(file)}
                        />
                      </div>
                      <IntegrityConfirmation
                        isChecked={integrityConfirmed}
                        onChange={setIntegrityConfirmed}
                      />
                      <Button
                        onClick={handleSubmit}
                        className="w-full"
                        isLoading={isSubmitting}
                        disabled={
                          isSubmitting ||
                          (!submissionText && !selectedFile) ||
                          !integrityConfirmed
                        }
                      >
                        Resubmit Assignment
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Submission locked notice */}
              {isLocked && (
                <SubmissionLockNotice
                  dueDate={assignment.dueDate}
                  allowLateSubmission={assignment.allowLateSubmission}
                />
              )}

              {!isLocked && (
                <>
                  {isOverdue && assignment.allowLateSubmission && (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-amber-600"
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
                        <div>
                          <p className="text-amber-700 font-medium">
                            This assignment is overdue
                          </p>
                          <p className="text-sm text-amber-600">
                            Late submissions are still accepted but will be
                            marked as late.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea
                      id="response"
                      placeholder="Write your answer here..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">
                      Attach File (Optional)
                    </label>
                    <FileUpload
                      onFileSelect={(file) => setSelectedFile(file)}
                    />
                  </div>

                  {/* Academic Integrity Confirmation */}
                  <IntegrityConfirmation
                    isChecked={integrityConfirmed}
                    onChange={setIntegrityConfirmed}
                  />

                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={
                      isSubmitting ||
                      (!submissionText && !selectedFile) ||
                      !integrityConfirmed
                    }
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Submit Assignment
                  </Button>
                </>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Teacher View - Feedback Panel */}
      {user?.role === "teacher" && existingSubmission && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-6">
            Student Submission Review
          </h2>

          {/* Submission Info */}
          <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Student:</span>{" "}
              {existingSubmission.studentName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Submitted:</span>{" "}
              {formatDate(existingSubmission.submittedAt)}
            </p>
          </div>

          {/* Submission History for Teacher */}
          {existingSubmission.attemptHistory &&
            existingSubmission.attemptHistory.length > 0 && (
              <div className="mb-6">
                <SubmissionHistory
                  attempts={existingSubmission.attemptHistory}
                  currentAttempt={existingSubmission.currentAttempt}
                  maxAttempts={assignment.maxAttempts}
                />
              </div>
            )}

          {/* Add/View Feedback */}
          <FeedbackPanel
            feedback={existingSubmission.feedback}
            isTeacher={true}
            onSubmitFeedback={handleAddFeedback}
          />

          {/* Grade Review Requests */}
          {currentGradeReviewRequests.length > 0 && (
            <div className="mt-6">
              <TeacherReviewRequestList
                requests={currentGradeReviewRequests}
                onRespond={handleRespondToReview}
              />
            </div>
          )}

          {/* Grading Panel */}
          <div className="mt-6">
            <GradingPanel
              submissionId={existingSubmission.id}
              teacherId={user?.id || ""}
              teacherName={user?.name || ""}
              existingGrade={existingSubmission.grade}
              assignmentRubric={assignment.rubric}
              onSaveGrade={handleSaveGrade}
              onPublishGrade={
                existingSubmission.grade?.status === "draft"
                  ? () => publishGrade(existingSubmission.grade!.id)
                  : undefined
              }
            />
          </div>
        </Card>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
