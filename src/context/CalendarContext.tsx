import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalendarEvent, ThemeOption, ViewType, CalendarTheme, EventType } from '@/types/calendar';
import { addDays, subDays, startOfMonth, endOfMonth, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Available theme options
export const themeOptions: ThemeOption[] = [
  { name: 'Lavender', value: 'theme-lavender', bgColor: '#9b87f5', textColor: 'white' },
  { name: 'Mint', value: 'theme-mint', bgColor: '#8BE8CB', textColor: 'black' },
  { name: 'Peach', value: 'theme-peach', bgColor: '#FEC6A1', textColor: 'black' },
  { name: 'Rose', value: 'theme-rose', bgColor: '#FFDEE2', textColor: 'black' },
  { name: 'Sky', value: 'theme-sky', bgColor: '#D3E4FD', textColor: 'black' },
  { name: 'Lemon', value: 'theme-lemon', bgColor: '#FEF7CD', textColor: 'black' },
];

// Available calendar theme options
export const calendarThemeOptions = [
  { name: 'Pastel', value: 'calendar-theme-pastel' },
  { name: 'Warm', value: 'calendar-theme-warm' },
  { name: 'Cool', value: 'calendar-theme-cool' },
  { name: 'Bright', value: 'calendar-theme-bright' },
  { name: 'Subtle', value: 'calendar-theme-subtle' },
];

// Sample events for demo purposes
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Morning Workout',
    date: new Date(),
    type: 'routine',
    time: '06:00',
    color: '#8BE8CB',
  },
  {
    id: '2',
    title: 'Team Meeting',
    date: new Date(),
    type: 'reminder',
    time: '10:00',
    color: '#9b87f5',
  },
  {
    id: '3',
    title: 'Evening Meditation',
    date: addDays(new Date(), 1),
    type: 'routine',
    time: '19:00',
    color: '#D3E4FD',
  },
];

interface CalendarContextType {
  events: CalendarEvent[];
  selectedDate: Date;
  selectedView: ViewType;
  currentMonth: Date;
  activeTheme: string;
  activeCalendarTheme: string;
  themeOptions: ThemeOption[];
  calendarThemeOptions: { name: string; value: string }[];
  getEventsForDate: (date: Date) => CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedView: (view: ViewType) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  goToToday: () => void;
  setActiveTheme: (theme: string) => void;
  setActiveCalendarTheme: (theme: string) => void;
  toggleEventCompletion: (eventId: string) => void;
  getDefaultColorForType: (type: EventType) => string;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<ViewType>('month');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [activeTheme, setActiveTheme] = useState<string>('theme-lavender');
  const [activeCalendarTheme, setActiveCalendarTheme] = useState<string>('calendar-theme-pastel');
  const { toast } = useToast();

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    const savedTheme = localStorage.getItem('calendarTheme');
    const savedCalendarTheme = localStorage.getItem('calendarColorTheme');
    
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert string dates back to Date objects
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error('Failed to parse saved events', error);
      }
    }
    
    if (savedTheme) {
      setActiveTheme(savedTheme);
    }
    
    if (savedCalendarTheme) {
      setActiveCalendarTheme(savedCalendarTheme);
    }

    // Apply themes to body
    document.body.className = `${activeTheme} ${activeCalendarTheme}`;
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calendarTheme', activeTheme);
    localStorage.setItem('calendarColorTheme', activeCalendarTheme);
    document.body.className = `${activeTheme} ${activeCalendarTheme}`;
  }, [activeTheme, activeCalendarTheme]);

  const getDefaultColorForType = (type: EventType): string => {
    const computedStyle = getComputedStyle(document.documentElement);
    return type === 'reminder' 
      ? computedStyle.getPropertyValue('--calendar-reminder-color').trim()
      : computedStyle.getPropertyValue('--calendar-routine-color').trim();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
      // Use default color from theme if none provided
      color: event.color || getDefaultColorForType(event.type),
    };
    
    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Event added",
      description: `"${event.title}" has been added to your calendar.`,
    });
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    toast({
      title: "Event updated",
      description: `"${updatedEvent.title}" has been updated.`,
    });
  };

  const deleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    setEvents(prev => prev.filter(event => event.id !== eventId));
    
    if (eventToDelete) {
      toast({
        title: "Event deleted",
        description: `"${eventToDelete.title}" has been removed.`,
      });
    }
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, completed: !event.completed } 
        : event
    ));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    setCurrentMonth(new Date());
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        selectedDate,
        selectedView,
        currentMonth,
        activeTheme,
        activeCalendarTheme,
        themeOptions,
        calendarThemeOptions,
        getEventsForDate,
        addEvent,
        updateEvent,
        deleteEvent,
        setSelectedDate,
        setSelectedView,
        nextMonth,
        prevMonth,
        goToToday,
        setActiveTheme,
        setActiveCalendarTheme,
        toggleEventCompletion,
        getDefaultColorForType,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
