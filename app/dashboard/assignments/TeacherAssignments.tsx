"use client";

import React, { useState } from "react";
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
} from "@/components/ui";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function TeacherAssignments() {
  const { user } = useAuth();
  const {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentSubmissions,
  } = useAssignments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("23:59");

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const handleOpenModal = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setTitle(assignment.title);
      setDescription(assignment.description);
      // Extract date and time from ISO string
      const dueDateObj = new Date(assignment.dueDate);
      setDueDate(dueDateObj.toISOString().split('T')[0]);
      setDueTime(dueDateObj.toTimeString().slice(0, 5));
    } else {
      setEditingAssignment(null);
      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("23:59");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("23:59");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time into ISO string
    const dueDateTimeString = `${dueDate}T${dueTime}:00`;

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, { title, description, dueDate: dueDateTimeString });
      setToast({
        isVisible: true,
        message: "Assignment updated successfully!",
        type: "success",
      });
    } else {
      addAssignment({
        title,
        description,
        dueDate: dueDateTimeString,
        teacherId: user?.id || "",
        teacherName: user?.name || "",
        difficulty: "medium",
        allowLateSubmission: true,
        maxAttempts: 3,
      });
      setToast({
        isVisible: true,
        message: "Assignment created successfully!",
        type: "success",
      });
    }

    handleCloseModal();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Assignments</h1>
          <p className="text-[#6B7280] mt-1">Manage all your assignments</p>
        </div>
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

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "published", "draft"] as const).map((f) => (
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

      {/* Assignments Table */}
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
          <p className="text-[#6B7280] mb-4">
            {filter === "all"
              ? "Create your first assignment to get started"
              : `No ${filter} assignments found`}
          </p>
          {filter === "all" && (
            <Button onClick={() => handleOpenModal()}>Create Assignment</Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#6B7280]">
                    Title
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#6B7280]">
                    Due Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#6B7280]">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#6B7280]">
                    Submissions
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#6B7280]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment, index) => {
                  const submissions = getAssignmentSubmissions(assignment.id);
                  return (
                    <tr
                      key={assignment.id}
                      className={`${
                        index !== filteredAssignments.length - 1
                          ? "border-b border-[#E5E7EB]"
                          : ""
                      } hover:bg-[#F9FAFB] transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#111827]">
                            {assignment.title}
                          </p>
                          <p className="text-sm text-[#6B7280] line-clamp-1">
                            {assignment.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {formatDate(assignment.dueDate)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            assignment.status === "published"
                              ? "success"
                              : "warning"
                          }
                        >
                          {assignment.status === "published"
                            ? "Published"
                            : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {submissions.length} received
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(assignment)}
                            className="p-2 text-[#6B7280] hover:text-[#6366F1] hover:bg-[#EEF2FF] rounded-lg transition-colors"
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
                          </button>
                          <button
                            onClick={() => handleDelete(assignment.id)}
                            className="p-2 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        <DialogContent>
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
              <div className="space-y-2">
                <Label htmlFor="dueTime">Due Time</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  required
                />
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
