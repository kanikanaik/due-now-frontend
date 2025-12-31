"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/app/context/AuthContext";
import { Button, Input, Card, Label } from "@/components/ui";
import { Mail, Lock, User, Shield, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, role);
      router.push("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6366F1] mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#111827]">
            Create an Account
          </h1>
          <p className="text-[#6B7280] mt-2">
            Join EduTask to manage your assignments
          </p>
        </div>

        {/* Register Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Toggle */}
            <div>
              <Label className="mb-2 block">I am a...</Label>
              <div className="flex rounded-lg bg-[#F3F4F6] p-1">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`
                    flex-1 py-2.5 px-4 rounded-md text-sm font-medium
                    transition-all duration-200
                    ${
                      role === "student"
                        ? "bg-white text-[#111827] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }
                  `}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`
                    flex-1 py-2.5 px-4 rounded-md text-sm font-medium
                    transition-all duration-200
                    ${
                      role === "teacher"
                        ? "bg-white text-[#111827] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }
                  `}
                >
                  👨‍🏫 Teacher
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={<User className="w-5 h-5" />}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="w-5 h-5" />}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="w-5 h-5" />}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                icon={<Shield className="w-5 h-5" />}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-[#6B7280] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#6366F1] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          By creating an account, you agree to our{" "}
          <a href="#" className="hover:text-[#6366F1]">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="hover:text-[#6366F1]">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
