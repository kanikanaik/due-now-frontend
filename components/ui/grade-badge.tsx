"use client";

import React from "react";
import { GradeStatus, getGradeStatusConfig, LetterGrade, getLetterGradeColor } from "@/lib/assignment-utils";
import { Badge } from "./badge";
import { CheckCircle2, FileEdit, Clock } from "lucide-react";

interface GradeStatusBadgeProps {
  status: GradeStatus;
  className?: string;
}

export function GradeStatusBadge({ status, className = "" }: GradeStatusBadgeProps) {
  const config = getGradeStatusConfig(status);
  
  const Icon = status === 'finalized' ? CheckCircle2 : status === 'draft' ? FileEdit : Clock;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.className}
        ${className}
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

interface LetterGradeBadgeProps {
  grade: LetterGrade;
  className?: string;
}

export function LetterGradeBadge({ grade, className = "" }: LetterGradeBadgeProps) {
  const colorClass = getLetterGradeColor(grade);
  
  return (
    <span
      className={`
        inline-flex items-center justify-center w-12 h-12 rounded-full text-2xl font-bold
        bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200
        ${colorClass}
        ${className}
      `}
    >
      {grade}
    </span>
  );
}

interface NumericScoreBadgeProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export function NumericScoreBadge({ 
  score, 
  maxScore = 100, 
  className = "" 
}: NumericScoreBadgeProps) {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (pct: number) => {
    if (pct >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (pct >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (pct >= 70) return "text-indigo-600 bg-indigo-50 border-indigo-200";
    if (pct >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div
      className={`
        inline-flex items-baseline gap-1 px-3 py-1.5 rounded-lg text-lg font-semibold
        border ${getScoreColor(percentage)}
        ${className}
      `}
    >
      <span>{score}</span>
      <span className="text-sm font-normal opacity-60">/ {maxScore}</span>
    </div>
  );
}

export function GradeVisibilityNote({ 
  isVisible, 
  publishedAt 
}: { 
  isVisible: boolean; 
  publishedAt?: string 
}) {
  if (isVisible && publishedAt) {
    const date = new Date(publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return (
      <p className="text-xs text-gray-500 flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
        Grade published on {date}
      </p>
    );
  }

  return (
    <p className="text-xs text-amber-600 flex items-center gap-1.5 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
      <Clock className="w-3.5 h-3.5" />
      Grades will be visible after teacher finalizes evaluation
    </p>
  );
}
