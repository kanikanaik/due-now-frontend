"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  AssignmentStatus, 
  Priority, 
  Difficulty, 
  FeedbackStatus 
} from "@/lib/assignment-utils";

export interface Feedback {
  id: string;
  submissionId: string;
  teacherId: string;
  teacherName: string;
  content: string;
  status: FeedbackStatus;
  createdAt: string;
}

export interface SubmissionAttempt {
  attemptNumber: number;
  submittedAt: string;
  fileUrl?: string;
  textContent?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'global' | 'assignment';
  assignmentId?: string;
  createdAt: string;
  createdBy: string;
  isRead?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  teacherId: string;
  teacherName: string;
  status: AssignmentStatus;
  priority: Priority;
  difficulty: Difficulty;
  attachmentUrl?: string;
  allowLateSubmission: boolean;
  maxAttempts: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  textContent?: string;
  status: "pending" | "submitted" | "overdue" | "late";
  attemptHistory: SubmissionAttempt[];
  currentAttempt: number;
  integrityConfirmed: boolean;
  feedback?: Feedback;
}

interface AssignmentContextType {
  assignments: Assignment[];
  submissions: Submission[];
  announcements: Announcement[];
  addAssignment: (
    assignment: Omit<Assignment, "id" | "createdAt" | "status">
  ) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignment: (
    submission: Omit<Submission, "id" | "submittedAt" | "status" | "attemptHistory" | "currentAttempt">
  ) => void;
  getStudentSubmissions: (studentId: string) => Submission[];
  getAssignmentSubmissions: (assignmentId: string) => Submission[];
  addFeedback: (submissionId: string, feedback: Omit<Feedback, "id" | "createdAt" | "submissionId">) => void;
  addAnnouncement: (announcement: Omit<Announcement, "id" | "createdAt">) => void;
  dismissAnnouncement: (announcementId: string) => void;
  getAssignmentAnnouncements: (assignmentId: string) => Announcement[];
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(
  undefined
);

// Mock data
const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Introduction to React Hooks",
    description:
      "Write a comprehensive essay explaining the useState and useEffect hooks in React. Include code examples and real-world use cases.",
    dueDate: "2025-01-05",
    createdAt: "2024-12-20",
    teacherId: "1",
    teacherName: "Dr. Sarah Johnson",
    status: "published",
    priority: "high",
    difficulty: "medium",
    allowLateSubmission: true,
    maxAttempts: 3,
  },
  {
    id: "2",
    title: "Database Design Project",
    description:
      "Design a relational database schema for an e-commerce platform. Include ER diagrams and SQL scripts for table creation.",
    dueDate: "2025-01-10",
    createdAt: "2024-12-22",
    teacherId: "1",
    teacherName: "Dr. Sarah Johnson",
    status: "published",
    priority: "medium",
    difficulty: "hard",
    allowLateSubmission: true,
    maxAttempts: 2,
  },
  {
    id: "3",
    title: "Algorithm Analysis",
    description:
      "Analyze the time and space complexity of the given sorting algorithms. Provide Big O notation and comparison charts.",
    dueDate: "2024-12-28",
    createdAt: "2024-12-15",
    teacherId: "1",
    teacherName: "Dr. Sarah Johnson",
    status: "closed",
    priority: "high",
    difficulty: "hard",
    allowLateSubmission: false,
    maxAttempts: 1,
  },
  {
    id: "4",
    title: "UI/UX Case Study",
    description:
      "Choose a popular mobile application and conduct a comprehensive UI/UX analysis. Include wireframes for suggested improvements.",
    dueDate: "2025-01-15",
    createdAt: "2024-12-25",
    teacherId: "1",
    teacherName: "Dr. Sarah Johnson",
    status: "published",
    priority: "low",
    difficulty: "easy",
    allowLateSubmission: true,
    maxAttempts: 5,
  },
  {
    id: "5",
    title: "JavaScript Fundamentals Quiz",
    description:
      "Complete the online quiz covering JavaScript basics including variables, functions, and control structures.",
    dueDate: "2025-01-01",
    createdAt: "2024-12-28",
    teacherId: "1",
    teacherName: "Dr. Sarah Johnson",
    status: "published",
    priority: "medium",
    difficulty: "easy",
    allowLateSubmission: false,
    maxAttempts: 1,
  },
  {
    id: "6",
    title: "API Integration Project",
    description:
      "Build a small application that integrates with a public API. Document your code and explain your design decisions.",
    dueDate: "2025-01-03",
    createdAt: "2024-12-29",
    teacherId: "1",
    teacherName: "Dr. Sarah Johnson",
    status: "published",
    priority: "high",
    difficulty: "medium",
    allowLateSubmission: true,
    maxAttempts: 2,
  },
];

const mockSubmissions: Submission[] = [
  {
    id: "1",
    assignmentId: "1",
    studentId: "2",
    studentName: "Alex Chen",
    submittedAt: "2024-12-30T14:30:00",
    textContent: "My essay on React Hooks...",
    status: "submitted",
    attemptHistory: [
      {
        attemptNumber: 1,
        submittedAt: "2024-12-28T10:00:00",
        textContent: "Initial draft of React Hooks essay...",
      },
      {
        attemptNumber: 2,
        submittedAt: "2024-12-30T14:30:00",
        textContent: "My essay on React Hooks...",
      },
    ],
    currentAttempt: 2,
    integrityConfirmed: true,
    feedback: {
      id: "f1",
      submissionId: "1",
      teacherId: "1",
      teacherName: "Dr. Sarah Johnson",
      content: "Good work! Your explanation of useEffect was particularly clear. Consider adding more examples of custom hooks in future submissions.",
      status: "reviewed",
      createdAt: "2024-12-31T09:00:00",
    },
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Office Hours Extended",
    content: "Office hours will be extended during the final week of the semester. Feel free to drop by for any questions about your assignments.",
    type: "global",
    createdAt: "2024-12-30T08:00:00",
    createdBy: "Dr. Sarah Johnson",
  },
  {
    id: "a2",
    title: "Clarification on Requirements",
    content: "For the React Hooks assignment, you may use TypeScript if you prefer. Make sure to include at least 3 code examples.",
    type: "assignment",
    assignmentId: "1",
    createdAt: "2024-12-29T10:00:00",
    createdBy: "Dr. Sarah Johnson",
  },
];

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

  const addAssignment = (
    assignment: Omit<Assignment, "id" | "createdAt" | "status">
  ) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      status: "draft",
    };
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const updateAssignment = (id: string, updatedData: Partial<Assignment>) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id ? { ...assignment, ...updatedData } : assignment
      )
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
  };

  const submitAssignment = (
    submission: Omit<Submission, "id" | "submittedAt" | "status" | "attemptHistory" | "currentAttempt">
  ) => {
    const existingSubmission = submissions.find(
      (s) => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId
    );
    const assignment = assignments.find((a) => a.id === submission.assignmentId);
    const isLate = assignment && new Date(assignment.dueDate) < new Date();
    
    if (existingSubmission) {
      // Update existing submission with new attempt
      const newAttempt: SubmissionAttempt = {
        attemptNumber: existingSubmission.currentAttempt + 1,
        submittedAt: new Date().toISOString(),
        textContent: submission.textContent,
        fileUrl: submission.fileUrl,
      };
      
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === existingSubmission.id
            ? {
                ...s,
                submittedAt: new Date().toISOString(),
                textContent: submission.textContent,
                fileUrl: submission.fileUrl,
                attemptHistory: [...s.attemptHistory, newAttempt],
                currentAttempt: s.currentAttempt + 1,
                status: isLate ? "late" : "submitted",
                integrityConfirmed: submission.integrityConfirmed,
              }
            : s
        )
      );
    } else {
      const newSubmission: Submission = {
        ...submission,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: isLate ? "late" : "submitted",
        attemptHistory: [
          {
            attemptNumber: 1,
            submittedAt: new Date().toISOString(),
            textContent: submission.textContent,
            fileUrl: submission.fileUrl,
          },
        ],
        currentAttempt: 1,
      };
      setSubmissions((prev) => [...prev, newSubmission]);
    }
  };

  const getStudentSubmissions = (studentId: string) => {
    return submissions.filter((sub) => sub.studentId === studentId);
  };

  const getAssignmentSubmissions = (assignmentId: string) => {
    return submissions.filter((sub) => sub.assignmentId === assignmentId);
  };

  const addFeedback = (
    submissionId: string,
    feedback: Omit<Feedback, "id" | "createdAt" | "submissionId">
  ) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
      submissionId,
      createdAt: new Date().toISOString(),
    };
    
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId ? { ...s, feedback: newFeedback } : s
      )
    );
  };

  const addAnnouncement = (announcement: Omit<Announcement, "id" | "createdAt">) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const dismissAnnouncement = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === announcementId ? { ...a, isRead: true } : a
      )
    );
  };

  const getAssignmentAnnouncements = (assignmentId: string) => {
    return announcements.filter(
      (a) => a.type === "assignment" && a.assignmentId === assignmentId
    );
  };

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        submissions,
        announcements,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        getStudentSubmissions,
        getAssignmentSubmissions,
        addFeedback,
        addAnnouncement,
        dismissAnnouncement,
        getAssignmentAnnouncements,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error("useAssignments must be used within an AssignmentProvider");
  }
  return context;
}
