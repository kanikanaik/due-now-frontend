"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import { AssignmentProvider } from "@/app/context/AssignmentContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AssignmentProvider>{children}</AssignmentProvider>
    </AuthProvider>
  );
}
