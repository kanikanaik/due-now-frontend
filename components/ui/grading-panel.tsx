"use client";

import React, { useState } from "react";
import { Grade, RubricCriterion } from "@/app/context/AssignmentContext";
import { LetterGrade, GradeStatus, scoreToLetterGrade } from "@/lib/assignment-utils";
import { Card } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { GradeStatusBadge } from "./grade-badge";
import { Save, Send, ChevronDown, ChevronUp, Plus, X } from "lucide-react";

interface GradingPanelProps {
  submissionId: string;
  teacherId: string;
  teacherName: string;
  existingGrade?: Grade;
  assignmentRubric?: RubricCriterion[];
  onSaveGrade: (grade: Omit<Grade, "id" | "submissionId" | "gradedAt" | "publishedAt">) => void;
  onPublishGrade?: (gradeId: string) => void;
}

export function GradingPanel({
  submissionId,
  teacherId,
  teacherName,
  existingGrade,
  assignmentRubric,
  onSaveGrade,
  onPublishGrade,
}: GradingPanelProps) {
  const [gradingMethod, setGradingMethod] = useState<"numeric" | "letter" | "rubric">(
    existingGrade?.rubricScores ? "rubric" : existingGrade?.letterGrade ? "letter" : "numeric"
  );
  const [numericScore, setNumericScore] = useState(existingGrade?.numericScore?.toString() || "");
  const [letterGrade, setLetterGrade] = useState<LetterGrade>(existingGrade?.letterGrade || "A");
  const [comments, setComments] = useState(existingGrade?.comments || "");
  const [rubricScores, setRubricScores] = useState<RubricCriterion[]>(
    existingGrade?.rubricScores || assignmentRubric || []
  );
  const [showRubric, setShowRubric] = useState(false);
  const [customRubric, setCustomRubric] = useState<RubricCriterion[]>([]);

  const calculateRubricTotal = () => {
    return rubricScores.reduce((total, criterion) => {
      const score = criterion.score || 0;
      const weight = criterion.weight || 0;
      return total + (score * weight / 100);
    }, 0);
  };

  const handleSaveDraft = () => {
    const grade: Omit<Grade, "id" | "submissionId" | "gradedAt" | "publishedAt"> = {
      teacherId,
      teacherName,
      status: "draft",
      comments,
    };

    if (gradingMethod === "numeric" && numericScore) {
      grade.numericScore = parseFloat(numericScore);
      grade.letterGrade = scoreToLetterGrade(parseFloat(numericScore));
    } else if (gradingMethod === "letter") {
      grade.letterGrade = letterGrade;
    } else if (gradingMethod === "rubric" && rubricScores.length > 0) {
      grade.rubricScores = rubricScores;
      grade.totalScore = calculateRubricTotal();
      grade.letterGrade = scoreToLetterGrade(grade.totalScore);
    }

    onSaveGrade(grade);
  };

  const handlePublish = () => {
    const grade: Omit<Grade, "id" | "submissionId" | "gradedAt" | "publishedAt"> = {
      teacherId,
      teacherName,
      status: "finalized",
      comments,
    };

    if (gradingMethod === "numeric" && numericScore) {
      grade.numericScore = parseFloat(numericScore);
      grade.letterGrade = scoreToLetterGrade(parseFloat(numericScore));
    } else if (gradingMethod === "letter") {
      grade.letterGrade = letterGrade;
    } else if (gradingMethod === "rubric" && rubricScores.length > 0) {
      grade.rubricScores = rubricScores;
      grade.totalScore = calculateRubricTotal();
      grade.letterGrade = scoreToLetterGrade(grade.totalScore);
    }

    onSaveGrade(grade);
  };

  const updateRubricScore = (id: string, score: number) => {
    setRubricScores(prev =>
      prev.map(criterion =>
        criterion.id === id ? { ...criterion, score } : criterion
      )
    );
  };

  const addCustomCriterion = () => {
    const newCriterion: RubricCriterion = {
      id: Date.now().toString(),
      name: "",
      weight: 0,
      score: 0,
    };
    setRubricScores(prev => [...prev, newCriterion]);
  };

  const removeCriterion = (id: string) => {
    setRubricScores(prev => prev.filter(c => c.id !== id));
  };

  return (
    <Card className="p-6 border-2 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Grade Submission</h3>
          <p className="text-sm text-gray-500 mt-1">
            Evaluate and provide feedback to the student
          </p>
        </div>
        {existingGrade && <GradeStatusBadge status={existingGrade.status} />}
      </div>

      {/* Grading Method Selection */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Grading Method
        </Label>
        <div className="flex gap-2">
          <button
            onClick={() => setGradingMethod("numeric")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              gradingMethod === "numeric"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
            }`}
          >
            Numeric Score
          </button>
          <button
            onClick={() => setGradingMethod("letter")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              gradingMethod === "letter"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
            }`}
          >
            Letter Grade
          </button>
          <button
            onClick={() => setGradingMethod("rubric")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              gradingMethod === "rubric"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
            }`}
          >
            Rubric-Based
          </button>
        </div>
      </div>

      {/* Numeric Score Input */}
      {gradingMethod === "numeric" && (
        <div className="mb-6">
          <Label htmlFor="numericScore" className="text-sm font-medium text-gray-700 mb-2 block">
            Score (0-100)
          </Label>
          <Input
            id="numericScore"
            type="number"
            min="0"
            max="100"
            value={numericScore}
            onChange={(e) => setNumericScore(e.target.value)}
            placeholder="Enter score..."
            className="max-w-xs"
          />
          {numericScore && (
            <p className="text-sm text-gray-500 mt-2">
              Letter Grade: <span className="font-semibold text-indigo-600">
                {scoreToLetterGrade(parseFloat(numericScore))}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Letter Grade Selection */}
      {gradingMethod === "letter" && (
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Grade
          </Label>
          <div className="flex gap-2">
            {(["A", "B", "C", "D", "F"] as LetterGrade[]).map((grade) => (
              <button
                key={grade}
                onClick={() => setLetterGrade(grade)}
                className={`w-12 h-12 rounded-full text-lg font-bold transition-all ${
                  letterGrade === grade
                    ? "bg-indigo-600 text-white shadow-lg scale-110"
                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rubric-Based Grading */}
      {gradingMethod === "rubric" && (
        <div className="mb-6">
          <button
            onClick={() => setShowRubric(!showRubric)}
            className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-700"
          >
            <span>Grading Rubric</span>
            {showRubric ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRubric && (
            <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
              {rubricScores.map((criterion) => (
                <div key={criterion.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600 mb-1 block">
                      {criterion.name} (Weight: {criterion.weight}%)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={criterion.score || ""}
                      onChange={(e) => updateRubricScore(criterion.id, parseFloat(e.target.value) || 0)}
                      placeholder="Score"
                      className="text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeCriterion(criterion.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button
                onClick={addCustomCriterion}
                variant="outline"
                className="w-full text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Criterion
              </Button>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700">
                  Total Score: <span className="text-indigo-600">{calculateRubricTotal().toFixed(2)}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      <div className="mb-6">
        <Label htmlFor="comments" className="text-sm font-medium text-gray-700 mb-2 block">
          Grading Comments (Optional)
        </Label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Provide feedback on the submission..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSaveDraft}
          variant="outline"
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button
          onClick={handlePublish}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
        >
          <Send className="w-4 h-4 mr-2" />
          Publish Grade
        </Button>
      </div>

      {existingGrade?.status === "draft" && (
        <p className="text-xs text-amber-600 mt-3 text-center">
          This grade is saved as draft and not visible to students yet
        </p>
      )}
    </Card>
  );
}
