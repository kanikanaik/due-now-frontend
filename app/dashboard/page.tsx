"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />;
}
