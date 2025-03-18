
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

// Add missing type definitions required by other components
export type EventType = 'class' | 'assignment' | 'test' | 'project' | 'personal';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: EventType;
  description?: string;
  location?: string;
  color?: string;
}

export type ViewType = 'day' | 'week' | 'month';

export type CalendarTheme = 'light' | 'dark' | 'system';

export type ThemeOption = {
  value: CalendarTheme;
  label: string;
  icon: React.ReactNode;
};

