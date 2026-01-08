"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssignments, Assignment } from "@/app/context/AssignmentContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  Card,
  Badge,
  Button,
  Input,
  Textarea,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Toast,
  StatusBadge,
  DeadlineBadge,
  PriorityBadge,
  DifficultyBadge,
  NoAssignmentsEmpty,
} from "@/components/ui";
import {
  Plus,
  Edit,
  Trash2,
  ClipboardList,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Priority, Difficulty, AssignmentStatus } from "@/lib/assignment-utils";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const {
    assignments,
    submissions,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentSubmissions,
    addAnnouncement,
  } = useAssignments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [status, setStatus] = useState<AssignmentStatus>("draft");
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState(3);

  // Announcement form state
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementType, setAnnouncementType] = useState<
    "global" | "assignment"
  >("global");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");

  // Stats
  const totalAssignments = assignments.length;
  const publishedAssignments = assignments.filter(
    (a) => a.status === "published"
  ).length;
  const draftAssignments = assignments.filter(
    (a) => a.status === "draft"
  ).length;
  
  // Get pending submissions to grade
  const teacherSubmissions = submissions.filter((sub) => {
    const assignment = assignments.find((a) => a.id === sub.assignmentId);
    return assignment?.teacherId === user?.id;
  });
  const pendingGrades = teacherSubmissions.filter(
    (sub) => !sub.grade || sub.grade.status === "not-graded"
  ).length;

  const handleOpenModal = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setTitle(assignment.title);
      setDescription(assignment.description);
      setDueDate(assignment.dueDate);
      setPriority(assignment.priority);
      setDifficulty(assignment.difficulty);
      setStatus(assignment.status);
      setAllowLateSubmission(assignment.allowLateSubmission);
      setMaxAttempts(assignment.maxAttempts);
    } else {
      setEditingAssignment(null);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setDifficulty("medium");
      setStatus("draft");
      setAllowLateSubmission(true);
      setMaxAttempts(3);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setDifficulty("medium");
    setStatus("draft");
    setAllowLateSubmission(true);
    setMaxAttempts(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, {
        title,
        description,
        dueDate,
        priority,
        difficulty,
        status,
        allowLateSubmission,
        maxAttempts,
      });
      setToast({
        isVisible: true,
        message: "Assignment updated successfully!",
        type: "success",
      });
    } else {
      addAssignment({
        title,
        description,
        dueDate,
        teacherId: user?.id || "",
        teacherName: user?.name || "",
        difficulty,
        allowLateSubmission,
        maxAttempts,
      });
      setToast({
        isVisible: true,
        message: "Assignment created successfully!",
        type: "success",
      });
    }

    handleCloseModal();
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addAnnouncement({
      title: announcementTitle,
      content: announcementContent,
      type: announcementType,
      assignmentId:
        announcementType === "assignment" ? selectedAssignmentId : undefined,
      createdBy: user?.name || "",
    });

    setToast({
      isVisible: true,
      message: "Announcement posted successfully!",
      type: "success",
    });

    setIsAnnouncementModalOpen(false);
    setAnnouncementTitle("");
    setAnnouncementContent("");
    setAnnouncementType("global");
    setSelectedAssignmentId("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment(id);
      setToast({
        isVisible: true,
        message: "Assignment deleted.",
        type: "success",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#111827]">
          Teacher Dashboard
        </h1>
        <p className="text-[#6B7280] mt-1">
          Manage your assignments and track submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#6366F1]"
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
          <div>
            <p className="text-sm text-[#6B7280]">Total Assignments</p>
            <p className="text-2xl font-semibold text-[#111827]">
              {totalAssignments}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#16A34A]"
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
          <div>
            <p className="text-sm text-[#6B7280]">Published</p>
            <p className="text-2xl font-semibold text-[#111827]">
              {publishedAssignments}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#D97706]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">Drafts</p>
            <p className="text-2xl font-semibold text-[#111827]">
              {draftAssignments}
            </p>
          </div>
        </Card>

        <Link href="/dashboard/teacher-submissions">
          <Card className="flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#FFEDD5] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#EA580C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Pending Grades</p>
              <p className="text-2xl font-semibold text-[#111827]">
                {pendingGrades}
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Assignments Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#111827]">
          Your Assignments
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAnnouncementModalOpen(true)}
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
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            Announce
          </Button>
          <Button onClick={() => handleOpenModal()}>
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <Card>
          <NoAssignmentsEmpty onCreateClick={() => handleOpenModal()} />
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submissionCount = getAssignmentSubmissions(
              assignment.id
            ).length;

            return (
              <Card
                key={assignment.id}
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <h3 className="font-medium text-[#111827]">
                      {assignment.title}
                    </h3>
                    <StatusBadge status={assignment.status} />
                  </div>

                  {/* Priority & Difficulty badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <PriorityBadge priority={assignment.priority} />
                    <DifficultyBadge difficulty={assignment.difficulty} />
                  </div>

                  <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">
                    {assignment.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-[#6B7280]">
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
                      {formatDate(assignment.dueDate)}
                    </div>
                    <DeadlineBadge dueDate={assignment.dueDate} />
                    <div className="flex items-center gap-1.5 text-[#6B7280]">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {submissionCount} submission
                      {submissionCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(assignment)}
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    <svg
                      className="w-4 h-4 text-[#EF4444]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAssignment ? "Edit Assignment" : "Create Assignment"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter assignment description and instructions"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              {editingAssignment && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as AssignmentStatus)
                    }
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min={1}
                  max={10}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={allowLateSubmission}
                    onChange={(e) => setAllowLateSubmission(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    Allow late submissions
                  </span>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAssignment ? "Save Changes" : "Create Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog
        open={isAnnouncementModalOpen}
        onOpenChange={(open) => !open && setIsAnnouncementModalOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAnnouncementSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="announcementTitle">Title</Label>
              <Input
                id="announcementTitle"
                placeholder="Announcement title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementContent">Message</Label>
              <Textarea
                id="announcementContent"
                placeholder="Write your announcement..."
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="announcementType"
                    value="global"
                    checked={announcementType === "global"}
                    onChange={() => setAnnouncementType("global")}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    Global Announcement
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="announcementType"
                    value="assignment"
                    checked={announcementType === "assignment"}
                    onChange={() => setAnnouncementType("assignment")}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    Assignment Clarification
                  </span>
                </label>
              </div>
            </div>
            {announcementType === "assignment" && (
              <div className="space-y-2">
                <Label htmlFor="assignmentSelect">Select Assignment</Label>
                <select
                  id="assignmentSelect"
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select an assignment...</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAnnouncementModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Post Announcement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
