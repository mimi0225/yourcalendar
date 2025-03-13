
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
