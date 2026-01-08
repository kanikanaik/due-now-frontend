"use client";

import React from "react";
import { Announcement } from "@/app/context/AssignmentContext";
import { formatRelativeTime } from "@/lib/assignment-utils";

interface AnnouncementItemProps {
  announcement: Announcement;
  onDismiss?: (id: string) => void;
}

function AnnouncementItem({ announcement, onDismiss }: AnnouncementItemProps) {
  if (announcement.isRead) return null;

  return (
    <div
      className={`
      relative p-4 rounded-lg border transition-all
      ${
        announcement.type === "global"
          ? "bg-indigo-50/50 border-indigo-200"
          : "bg-blue-50/50 border-blue-200"
      }
    `}
    >
      {onDismiss && (
        <button
          onClick={() => onDismiss(announcement.id)}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/50 transition-colors"
          aria-label="Dismiss announcement"
        >
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <div className="flex items-start gap-3 pr-6">
        <div
          className={`
          w-8 h-8 rounded-full flex items-center justify-center shrink-0
          ${announcement.type === "global" ? "bg-indigo-100" : "bg-blue-100"}
        `}
        >
          {announcement.type === "global" ? (
            <svg
              className="w-4 h-4 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900">
              {announcement.title}
            </h4>
            <span
              className={`
              text-xs px-1.5 py-0.5 rounded
              ${
                announcement.type === "global"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-blue-100 text-blue-700"
              }
            `}
            >
              {announcement.type === "global"
                ? "Announcement"
                : "Clarification"}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{announcement.createdBy}</span>
            <span>•</span>
            <span>{formatRelativeTime(announcement.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AnnouncementListProps {
  announcements: Announcement[];
  onDismiss?: (id: string) => void;
  maxItems?: number;
}

export function AnnouncementList({
  announcements,
  onDismiss,
  maxItems = 5,
}: AnnouncementListProps) {
  const visibleAnnouncements = announcements
    .filter((a) => !a.isRead)
    .slice(0, maxItems);

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {visibleAnnouncements.map((announcement) => (
        <AnnouncementItem
          key={announcement.id}
          announcement={announcement}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

interface AssignmentAnnouncementsProps {
  announcements: Announcement[];
}

export function AssignmentAnnouncements({
  announcements,
}: AssignmentAnnouncementsProps) {
  if (announcements.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Clarifications & Updates
      </h3>
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="p-3 rounded-lg bg-blue-50/50 border border-blue-100"
        >
          <p className="text-sm text-gray-700">{announcement.content}</p>
          <p className="text-xs text-gray-400 mt-2">
            {formatRelativeTime(announcement.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}
