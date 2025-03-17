
import React from 'react';
import { useSports } from '@/context/SportsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { Trophy, Clock } from 'lucide-react';

const SportsCalendar = () => {
  const { events, teams, getTeamById } = useSports();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  
  // Get events for the selected date
  const eventsForSelectedDate = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );
  
  // Function to get the days that have events
  const getDaysWithEvents = () => {
    return events.map(event => new Date(event.date));
  };

  const eventDates = getDaysWithEvents();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sports Calendar</CardTitle>
          <CardDescription>
            Select a date to view scheduled events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar 
            mode="single" 
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border" 
            modifiers={{
              highlight: eventDates
            }}
            modifiersStyles={{
              highlight: { 
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontWeight: 'bold'
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Events for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
          <CardDescription>
            {eventsForSelectedDate.length} event{eventsForSelectedDate.length !== 1 ? 's' : ''} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventsForSelectedDate.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No sports events scheduled for this day
            </div>
          ) : (
            <div className="space-y-4">
              {eventsForSelectedDate.map(event => {
                const team = getTeamById(event.teamId);
                
                return (
                  <div 
                    key={event.id}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: team?.color || '#9b87f5'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {team?.name}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {event.eventType === 'game' ? 
                              <Trophy className="h-3 w-3" /> : 
                              <Clock className="h-3 w-3" />}
                            <span className="capitalize">{event.eventType}</span>
                          </Badge>
                          
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                          </Badge>
                          
                          {event.location && (
                            <span className="text-sm">
                              at {event.location}
                            </span>
                          )}
                        </div>
                        
                        {event.notes && (
                          <p className="mt-2 text-sm">
                            {event.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SportsCalendar;
