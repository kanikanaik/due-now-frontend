"use client";

import React from "react";
import Link from "next/link";
import { Assignment, Submission } from "@/app/context/AssignmentContext";
import { Card } from "./card";
import { Badge } from "./badge";
import { LetterGradeBadge, NumericScoreBadge, GradeStatusBadge } from "./grade-badge";
import { Award, TrendingUp, BookOpen, ExternalLink } from "lucide-react";

interface GradesOverviewProps {
  assignments: Assignment[];
  submissions: Submission[];
}

export function GradesOverview({ assignments, submissions }: GradesOverviewProps) {
  // Filter submissions with finalized grades
  const gradedSubmissions = submissions.filter(
    (sub) => sub.grade && sub.grade.status === "finalized"
  );

  // Calculate average score
  const calculateAverage = () => {
    if (gradedSubmissions.length === 0) return null;
    
    const scores = gradedSubmissions.map((sub) => {
      if (sub.grade?.numericScore !== undefined) {
        return sub.grade.numericScore;
      } else if (sub.grade?.totalScore !== undefined) {
        return sub.grade.totalScore;
      }
      return 0;
    });

    const sum = scores.reduce((acc, score) => acc + score, 0);
    return (sum / scores.length).toFixed(1);
  };

  const averageScore = calculateAverage();

  if (gradedSubmissions.length === 0) {
    return (
      <Card className="p-8 bg-gradient-to-br from-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Grades Yet
          </h3>
          <p className="text-sm text-gray-500">
            Your grades will appear here once teachers evaluate your submissions
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Graded</p>
              <p className="text-2xl font-bold text-indigo-600">
                {gradedSubmissions.length}
              </p>
            </div>
          </div>
        </Card>

        {averageScore && (
          <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {averageScore}%
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600">
                {submissions.length - gradedSubmissions.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Graded Assignments List */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Grades
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            View all your graded assignments
          </p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {gradedSubmissions.map((submission) => {
            const assignment = assignments.find(
              (a) => a.id === submission.assignmentId
            );
            if (!assignment) return null;

            return (
              <Link
                key={submission.id}
                href={`/dashboard/assignments/${assignment.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {assignment.title}
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>
                        Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                      {submission.grade?.publishedAt && (
                        <span>
                          Graded {new Date(submission.grade.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {submission.grade?.letterGrade && (
                      <LetterGradeBadge 
                        grade={submission.grade.letterGrade} 
                        className="w-10 h-10 text-lg"
                      />
                    )}
                    {submission.grade?.numericScore !== undefined && (
                      <NumericScoreBadge 
                        score={submission.grade.numericScore}
                        className="text-base"
                      />
                    )}
                    {submission.grade?.totalScore !== undefined && 
                     submission.grade?.numericScore === undefined && (
                      <NumericScoreBadge 
                        score={Math.round(submission.grade.totalScore)}
                        className="text-base"
                      />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
