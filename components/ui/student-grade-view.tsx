"use client";

import React from "react";
import { Grade } from "@/app/context/AssignmentContext";
import { Card } from "./card";
import { 
  GradeStatusBadge, 
  LetterGradeBadge, 
  NumericScoreBadge,
  GradeVisibilityNote 
} from "./grade-badge";
import { Award, MessageSquare, Calendar } from "lucide-react";

interface StudentGradeViewProps {
  grade?: Grade;
  assignmentTitle: string;
  submittedAt: string;
}

export function StudentGradeView({
  grade,
  assignmentTitle,
  submittedAt,
}: StudentGradeViewProps) {
  // Only show finalized grades to students
  if (!grade || grade.status !== "finalized") {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Grade Pending
          </h3>
          <GradeVisibilityNote isVisible={false} />
        </div>
      </Card>
    );
  }

  const submissionDate = new Date(submittedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-green-50/30 border-2 border-green-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Your Grade
          </h3>
          <p className="text-sm text-gray-500">
            {assignmentTitle}
          </p>
        </div>
        <GradeStatusBadge status={grade.status} />
      </div>

      {/* Grade Display */}
      <div className="flex items-center gap-6 mb-6 p-6 bg-white rounded-lg border border-gray-200">
        {/* Letter Grade */}
        {grade.letterGrade && (
          <div className="flex flex-col items-center">
            <LetterGradeBadge grade={grade.letterGrade} />
            <span className="text-xs text-gray-500 mt-2">Letter Grade</span>
          </div>
        )}

        {/* Numeric Score */}
        {grade.numericScore !== undefined && (
          <div className="flex flex-col items-center">
            <NumericScoreBadge score={grade.numericScore} />
            <span className="text-xs text-gray-500 mt-2">Score</span>
          </div>
        )}

        {/* Rubric Total */}
        {grade.totalScore !== undefined && !grade.numericScore && (
          <div className="flex flex-col items-center">
            <NumericScoreBadge score={Math.round(grade.totalScore)} />
            <span className="text-xs text-gray-500 mt-2">Total Score</span>
          </div>
        )}
      </div>

      {/* Rubric Breakdown */}
      {grade.rubricScores && grade.rubricScores.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Rubric Breakdown
          </h4>
          <div className="space-y-2">
            {grade.rubricScores.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {criterion.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Weight: {criterion.weight}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-indigo-600">
                    {criterion.score || 0} / 100
                  </p>
                  <p className="text-xs text-gray-500">
                    {((criterion.score || 0) * criterion.weight / 100).toFixed(1)} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher Feedback */}
      {grade.comments && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-semibold text-gray-700">
              Teacher Feedback
            </h4>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {grade.comments}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Graded by {grade.teacherName}
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Submitted on {submissionDate}</span>
        </div>
        <GradeVisibilityNote 
          isVisible={true} 
          publishedAt={grade.publishedAt} 
        />
      </div>
    </Card>
  );
}
