
import { useCalendar } from '@/context/CalendarContext';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  format 
} from 'date-fns';
import { cn } from '@/lib/utils';

const WeekView = () => {
  const { selectedDate, setSelectedDate, getEventsForDate } = useCalendar();
  
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const today = new Date();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          const events = getEventsForDate(day);
          
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="text-sm font-medium text-center mb-1">
                {format(day, 'EEE')}
              </div>
              <button
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full",
                  isToday && "bg-accent",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && !isToday && "hover:bg-muted"
                )}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, 'd')}
              </button>
              {events.length > 0 && (
                <div className="text-xs text-center mt-1">
                  <span className="font-medium">{events.length}</span> 
                  <span className="text-muted-foreground"> event{events.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h3>
        
        {getEventsForDate(selectedDate).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No events scheduled for this day
          </div>
        ) : (
          <div className="space-y-2">
            {getEventsForDate(selectedDate)
              .sort((a, b) => {
                if (!a.time) return 1;
                if (!b.time) return -1;
                return a.time.localeCompare(b.time);
              })
              .map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border animate-fade-in"
                  style={{ 
                    borderLeftWidth: '4px',
                    borderLeftColor: event.color || '#9b87f5'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: event.color || '#9b87f5' }}
                          ></div>
                          <span className="capitalize">{event.type}</span>
                        </div>
                        {event.time && (
                          <span className="ml-2">{event.time}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekView;
