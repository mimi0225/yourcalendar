
import { useCalendar } from '@/context/CalendarContext';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  format,
  addDays,
  eachDayOfInterval
} from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

const MonthView = () => {
  const { 
    currentMonth, 
    selectedDate, 
    setSelectedDate, 
    getEventsForDate,
    getDefaultColorForType
  } = useCalendar();
  
  // Calculate days to display in the calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const today = new Date();
  
  const renderEventPreview = (events: CalendarEvent[], date: Date) => {
    if (events.length === 0) return null;
    
    const maxEventsToShow = 2;
    const visibleEvents = events.slice(0, maxEventsToShow);
    const remainingCount = events.length - maxEventsToShow;
    
    return (
      <div className="event-container mt-1 px-0.5">
        {visibleEvents.map((event) => (
          <div 
            key={event.id}
            className={`calendar-event ${event.type}-type`}
            style={{ 
              backgroundColor: event.color || getDefaultColorForType(event.type),
              color: event.color && isLightColor(event.color) ? 'black' : 'white'
            }}
          >
            {event.time && <span className="text-[0.65rem] mr-1">{event.time}</span>}
            <span>{truncateText(event.title, 10)}</span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="text-xs text-muted-foreground">+{remainingCount} more</div>
        )}
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const isLightColor = (color: string) => {
    // Simple light/dark detection based on hex color
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-7">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, dayIdx) => {
          const formattedDate = format(day, 'd');
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          const dayEvents = getEventsForDate(day);
          
          return (
            <div
              key={dayIdx}
              className={cn(
                "calendar-cell",
                !isCurrentMonth && "text-muted-foreground bg-muted/30",
                isToday && "today",
                isSelected && "ring-2 ring-primary ring-inset"
              )}
              onClick={() => setSelectedDate(day)}
            >
              <span className="calendar-date">{formattedDate}</span>
              {renderEventPreview(dayEvents, day)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
