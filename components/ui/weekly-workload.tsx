"use client";

import React from "react";
import Link from "next/link";
import { Assignment } from "@/app/context/AssignmentContext";
import { getWeeklyAssignments, getDeadlineInfo } from "@/lib/assignment-utils";
import { DeadlineBadge } from "./deadline-badge";
import { PriorityBadge, DifficultyBadge } from "./priority-badges";

interface WeeklyWorkloadProps {
  assignments: Assignment[];
  studentSubmissions?: string[]; // Array of submitted assignment IDs
}

export function WeeklyWorkload({ assignments, studentSubmissions = [] }: WeeklyWorkloadProps) {
  const { thisWeek, nextWeek } = getWeeklyAssignments(assignments);
  
  // Filter out submitted assignments for students
  const pendingThisWeek = thisWeek.filter(a => !studentSubmissions.includes(a.id));
  const pendingNextWeek = nextWeek.filter(a => !studentSubmissions.includes(a.id));
  
  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const renderAssignmentItem = (assignment: Assignment) => {
    const deadlineInfo = getDeadlineInfo(assignment.dueDate);
    
    return (
      <Link
        key={assignment.id}
        href={`/dashboard/assignments/${assignment.id}`}
        className={`
          block p-3 rounded-lg border transition-all hover:shadow-sm
          ${deadlineInfo.urgency === 'urgent' ? 'border-amber-200 bg-amber-50/50' : 
            deadlineInfo.urgency === 'warning' ? 'border-yellow-200 bg-yellow-50/30' : 
            'border-gray-200 bg-white hover:border-gray-300'}
        `}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1 flex-1">
            {assignment.title}
          </h4>
          <div className="flex gap-1 shrink-0">
            <PriorityBadge priority={assignment.priority} compact />
            <DifficultyBadge difficulty={assignment.difficulty} compact />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{formatShortDate(assignment.dueDate)}</span>
          <DeadlineBadge dueDate={assignment.dueDate} showIcon={false} />
        </div>
      </Link>
    );
  };
  
  const EmptyWeek = ({ message }: { message: string }) => (
    <div className="text-center py-6 text-gray-400">
      <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* This Week */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <h3 className="font-medium text-gray-900">This Week</h3>
            {pendingThisWeek.length > 0 && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {pendingThisWeek.length} due
              </span>
            )}
          </div>
          <div className="space-y-2">
            {pendingThisWeek.length > 0 ? (
              pendingThisWeek.map(renderAssignmentItem)
            ) : (
              <EmptyWeek message="All caught up!" />
            )}
          </div>
        </div>
        
        {/* Next Week */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <h3 className="font-medium text-gray-900">Next Week</h3>
            {pendingNextWeek.length > 0 && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {pendingNextWeek.length} upcoming
              </span>
            )}
          </div>
          <div className="space-y-2">
            {pendingNextWeek.length > 0 ? (
              pendingNextWeek.map(renderAssignmentItem)
            ) : (
              <EmptyWeek message="No upcoming deadlines" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
