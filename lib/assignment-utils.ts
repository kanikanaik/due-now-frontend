// Assignment Utility Functions for deadline intelligence and status management

export type AssignmentStatus = 'draft' | 'published' | 'submitted' | 'late' | 'closed';
export type Priority = 'low' | 'medium' | 'high';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type FeedbackStatus = 'reviewed' | 'needs-improvement' | 'pending';

export interface DeadlineInfo {
  label: string;
  urgency: 'normal' | 'warning' | 'urgent' | 'overdue';
  daysRemaining: number;
  isLocked: boolean;
}

/**
 * Calculate deadline information with human-readable labels
 */
export function getDeadlineInfo(dueDate: string): DeadlineInfo {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);
  
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const daysLate = Math.abs(diffDays);
    return {
      label: daysLate === 1 ? 'Late by 1 day' : `Late by ${daysLate} days`,
      urgency: 'overdue',
      daysRemaining: diffDays,
      isLocked: true,
    };
  }
  
  if (diffDays === 0) {
    return {
      label: 'Due Today',
      urgency: 'urgent',
      daysRemaining: 0,
      isLocked: false,
    };
  }
  
  if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      urgency: 'warning',
      daysRemaining: 1,
      isLocked: false,
    };
  }
  
  if (diffDays <= 3) {
    return {
      label: `Due in ${diffDays} days`,
      urgency: 'warning',
      daysRemaining: diffDays,
      isLocked: false,
    };
  }
  
  if (diffDays <= 7) {
    return {
      label: `Due in ${diffDays} days`,
      urgency: 'normal',
      daysRemaining: diffDays,
      isLocked: false,
    };
  }
  
  return {
    label: `Due in ${diffDays} days`,
    urgency: 'normal',
    daysRemaining: diffDays,
    isLocked: false,
  };
}

/**
 * Get assignments for current and next week
 */
export function getWeeklyAssignments<T extends { dueDate: string }>(
  assignments: T[]
): { thisWeek: T[]; nextWeek: T[] } {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const startOfNextWeek = new Date(endOfWeek);
  startOfNextWeek.setDate(endOfWeek.getDate() + 1);
  startOfNextWeek.setHours(0, 0, 0, 0);
  
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
  endOfNextWeek.setHours(23, 59, 59, 999);
  
  const thisWeek = assignments.filter((a) => {
    const due = new Date(a.dueDate);
    return due >= startOfWeek && due <= endOfWeek;
  });
  
  const nextWeek = assignments.filter((a) => {
    const due = new Date(a.dueDate);
    return due >= startOfNextWeek && due <= endOfNextWeek;
  });
  
  return { thisWeek, nextWeek };
}

/**
 * Format relative time for submissions
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Get urgency color classes for deadline indicators
 */
export function getUrgencyClasses(urgency: DeadlineInfo['urgency']): {
  bg: string;
  text: string;
  border: string;
} {
  switch (urgency) {
    case 'overdue':
      return {
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
      };
    case 'urgent':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
      };
  }
}

/**
 * Get status badge configuration
 */
export function getStatusConfig(status: AssignmentStatus): {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'pending' | 'primary' | 'secondary' | 'destructive' | 'outline';
} {
  switch (status) {
    case 'draft':
      return { label: 'Draft', variant: 'secondary' };
    case 'published':
      return { label: 'Published', variant: 'primary' };
    case 'submitted':
      return { label: 'Submitted', variant: 'success' };
    case 'late':
      return { label: 'Late', variant: 'warning' };
    case 'closed':
      return { label: 'Closed', variant: 'default' };
    default:
      return { label: 'Unknown', variant: 'default' };
  }
}

/**
 * Get priority configuration for badges
 */
export function getPriorityConfig(priority: Priority): {
  label: string;
  className: string;
} {
  switch (priority) {
    case 'high':
      return {
        label: 'High Priority',
        className: 'bg-red-100 text-red-700 border border-red-200',
      };
    case 'medium':
      return {
        label: 'Medium Priority',
        className: 'bg-amber-100 text-amber-700 border border-amber-200',
      };
    case 'low':
      return {
        label: 'Low Priority',
        className: 'bg-green-100 text-green-700 border border-green-200',
      };
  }
}

/**
 * Get difficulty configuration for badges
 */
export function getDifficultyConfig(difficulty: Difficulty): {
  label: string;
  className: string;
} {
  switch (difficulty) {
    case 'hard':
      return {
        label: 'Hard',
        className: 'bg-purple-100 text-purple-700 border border-purple-200',
      };
    case 'medium':
      return {
        label: 'Medium',
        className: 'bg-blue-100 text-blue-700 border border-blue-200',
      };
    case 'easy':
      return {
        label: 'Easy',
        className: 'bg-teal-100 text-teal-700 border border-teal-200',
      };
  }
}
