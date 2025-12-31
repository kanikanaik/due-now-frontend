"use client";

import React, { useState } from "react";
import { Feedback } from "@/app/context/AssignmentContext";
import { FeedbackStatusBadge } from "./status-badge";
import { formatRelativeTime } from "@/lib/assignment-utils";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Label } from "./label";

interface FeedbackPanelProps {
  feedback?: Feedback;
  isTeacher?: boolean;
  onSubmitFeedback?: (content: string, status: 'reviewed' | 'needs-improvement') => void;
}

export function FeedbackPanel({ feedback, isTeacher = false, onSubmitFeedback }: FeedbackPanelProps) {
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<'reviewed' | 'needs-improvement'>('reviewed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!feedbackContent.trim() || !onSubmitFeedback) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmitFeedback(feedbackContent, feedbackStatus);
    setFeedbackContent("");
    setIsSubmitting(false);
  };
  
  // Display existing feedback
  if (feedback) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="font-medium text-gray-900">Teacher Feedback</span>
            </div>
            <FeedbackStatusBadge status={feedback.status} />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <span>{feedback.teacherName}</span>
            <span>•</span>
            <span>{formatRelativeTime(feedback.createdAt)}</span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{feedback.content}</p>
        </div>
      </div>
    );
  }
  
  // Teacher feedback form (when no feedback exists)
  if (isTeacher && onSubmitFeedback) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-medium text-gray-900">Add Feedback</span>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Provide feedback on this submission..."
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFeedbackStatus('reviewed')}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${feedbackStatus === 'reviewed'
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }
                `}
              >
                ✓ Reviewed
              </button>
              <button
                type="button"
                onClick={() => setFeedbackStatus('needs-improvement')}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${feedbackStatus === 'needs-improvement'
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }
                `}
              >
                ⚠ Needs Improvement
              </button>
            </div>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!feedbackContent.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </div>
    );
  }
  
  // No feedback message for students
  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
      <div className="flex items-center gap-3 text-gray-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span className="text-sm">No feedback yet. Check back later.</span>
      </div>
    </div>
  );
}
