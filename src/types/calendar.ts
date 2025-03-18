
export type ClassPriority = 'low' | 'medium' | 'high';

export interface Class {
  id: string;
  name: string;
  instructor: string;
  location: string;
  days: string[];
  startTime: string;
  endTime: string;
  color: string;
  priority: ClassPriority;
}

export type AssignmentType = 'homework' | 'paper' | 'presentation';

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  dueDate: Date;
  type: AssignmentType;
  description?: string;
  completed: boolean;
  weight?: number;
}

export type TestType = 'quiz' | 'midterm' | 'final' | 'test';

export interface Test {
  id: string;
  title: string;
  classId: string;
  date: Date;
  time: string;
  type: TestType;
  location: string;
  topics: string[];
  completed: boolean;
}

export type ProjectType = 'individual' | 'group' | 'research';

export interface ProjectMilestone {
  title: string;
  dueDate: Date;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  classId: string;
  dueDate: Date;
  type: ProjectType;
  description?: string;
  teamMembers: string[];
  milestones: ProjectMilestone[];
  completed: boolean;
  weight?: number;
}

// Updated EventType to match what's used in the application
export type EventType = 'class' | 'assignment' | 'test' | 'project' | 'personal' | 'routine' | 'reminder';

export interface CalendarEvent {
  id: string;
  title: string;
  // Updated to include both start/end dates and legacy date/time fields to fix type errors
  start?: Date;
  end?: Date;
  date?: Date;
  time?: string;
  allDay?: boolean;
  type: EventType;
  description?: string;
  location?: string;
  color?: string;
  completed?: boolean;
}

export type ViewType = 'day' | 'week' | 'month';

export type CalendarTheme = 'light' | 'dark' | 'system' | 'theme-lavender' | 'theme-mint' | 'theme-peach' | 'theme-rose' | 'theme-sky' | 'theme-lemon' | 'calendar-theme-pastel' | 'calendar-theme-warm' | 'calendar-theme-cool' | 'calendar-theme-bright' | 'calendar-theme-subtle';

export type ThemeOption = {
  value: CalendarTheme;
  label: string;
  icon?: React.ReactNode;
  name?: string;
  bgColor?: string;
  textColor?: string;
};

// Settings related types
export interface TabSettings {
  student: boolean;
  period: boolean;
  sports: boolean;
  settings: boolean;
  chores: boolean;
  budget: boolean;
}
