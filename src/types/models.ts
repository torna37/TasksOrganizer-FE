
export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface TaskList {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  memberCount?: number; // Used for UI display
}

export interface Membership {
  id: string;
  userId: string;       // FK → User
  taskListId: string;   // FK → TaskList
  role: 'owner' | 'admin' | 'member';
}

export interface Task {
  id: string;
  taskListId: string;   // FK → TaskList
  title: string;
  description?: string;
  dueDate?: Date;       // Used if non-recurring
  isRecurring: boolean;
  isCompleted?: boolean; // Used for UI display
  assignees?: User[];    // Used for UI display
}

export interface RecurrenceRule {
  id: string;
  taskId: string;       // FK → Task
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];        // 0 = Sunday, ..., 6 = Saturday
  daysOfMonth?: number[];       // 1–31
  monthsOfYear?: number[];      // 1 = January, ..., 12 = December
  ordinalWeekdays?: {
    weekday: number;            // 0–6
    ordinal: number;            // 1 = first, 2 = second, etc.
  }[];
}

export interface TaskOccurrence {
  id: string;
  taskId: string;       // FK → Task
  dueDate: Date;
  isCompleted?: boolean; // Used for UI
}

export interface TaskCompletion {
  id: string;
  taskOccurrenceId: string;  // FK → TaskOccurrence
  userId: string;            // FK → User
  completedAt: Date;
}

export interface TaskAssignment {
  id: string;
  taskId: string;       // FK → Task
  userId: string;       // FK → User
}
