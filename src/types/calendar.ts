
export type EventType = 'reminder' | 'routine';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  time?: string;
  description?: string;
  color?: string; // For custom coloring
  completed?: boolean; // Especially for routine items
}

export interface ThemeOption {
  name: string;
  value: string;
  bgColor: string;
  textColor: string;
}

export interface CalendarTheme {
  reminderColor: string;
  routineColor: string;
  todayHighlight: string;
  selectedHighlight: string;
}

export type ViewType = 'month' | 'week' | 'day';

// Student-related types
export type ClassPriority = 'high' | 'medium' | 'low';
export type AssignmentType = 'homework' | 'project' | 'paper' | 'reading' | 'other';
export type TestType = 'quiz' | 'midterm' | 'final' | 'exam' | 'other';

export interface Class {
  id: string;
  name: string;
  instructor: string;
  location?: string;
  days: string[]; // e.g., ['Monday', 'Wednesday', 'Friday']
  startTime?: string;
  endTime?: string;
  color: string;
  priority: ClassPriority;
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  dueDate: Date;
  type: AssignmentType;
  description?: string;
  completed: boolean;
  weight?: number; // percentage of grade
}

export interface Test {
  id: string;
  title: string;
  classId: string;
  date: Date;
  time?: string;
  type: TestType;
  location?: string;
  topics?: string[];
  completed: boolean;
}
