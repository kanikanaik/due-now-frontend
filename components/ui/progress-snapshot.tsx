"use client";

import React from "react";

interface ProgressSnapshotProps {
  total: number;
  submitted: number;
  pending: number;
  overdue: number;
}

export function ProgressSnapshot({ total, submitted, pending, overdue }: ProgressSnapshotProps) {
  const completionRate = total > 0 ? Math.round((submitted / total) * 100) : 0;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Progress Overview</h3>
        <span className="text-2xl font-semibold text-indigo-600">{completionRate}%</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className="h-full flex">
          <div
            className="bg-green-500 transition-all duration-500"
            style={{ width: `${total > 0 ? (submitted / total) * 100 : 0}%` }}
          />
          <div
            className="bg-red-400 transition-all duration-500"
            style={{ width: `${total > 0 ? (overdue / total) * 100 : 0}%` }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{submitted}</div>
          <div className="text-xs text-gray-500">Submitted</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-amber-600">{pending}</div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">{overdue}</div>
          <div className="text-xs text-gray-500">Overdue</div>
        </div>
      </div>
    </div>
  );
}
