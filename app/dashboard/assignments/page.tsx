"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import TeacherAssignments from "./TeacherAssignments";
import StudentAssignments from "./StudentAssignments";

export default function AssignmentsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === "teacher" ? (
    <TeacherAssignments />
  ) : (
    <StudentAssignments />
  );
}
