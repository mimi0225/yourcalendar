
import { useCalendar } from '@/context/CalendarContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';

const DayView = () => {
  const { selectedDate, getEventsForDate } = useCalendar();
  
  const events = getEventsForDate(selectedDate);
  
  // Group events by type
  const reminders = events.filter(event => event.type === 'reminder');
  const routines = events.filter(event => event.type === 'routine');
  
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </h2>
      
      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No events scheduled for today
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Timeline</h3>
            <div className="space-y-2">
              {sortedEvents.map((event) => (
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
                      {event.description && (
                        <p className="mt-1 text-sm">{event.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {routines.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Routines</h3>
              <div className="space-y-2">
                {routines.map((routine) => (
                  <div 
                    key={routine.id}
                    className="p-3 rounded-lg border animate-fade-in"
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: routine.color || '#8BE8CB'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{routine.title}</h4>
                        {routine.time && (
                          <div className="text-sm text-muted-foreground">
                            {routine.time}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {reminders.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Reminders</h3>
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div 
                    key={reminder.id}
                    className="p-3 rounded-lg border animate-fade-in"
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: reminder.color || '#9b87f5'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{reminder.title}</h4>
                        {reminder.time && (
                          <div className="text-sm text-muted-foreground">
                            {reminder.time}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayView;
