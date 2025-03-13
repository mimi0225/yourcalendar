
import { useState } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditEventDialog from './EditEventDialog';

const EventList = () => {
  const { selectedDate, getEventsForDate, deleteEvent, toggleEventCompletion } = useCalendar();
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  
  const events = getEventsForDate(selectedDate);
  
  const handleDeleteEvent = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      setEventToDelete(null);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Events for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
          <CardDescription>
            {events.length} event{events.length !== 1 ? 's' : ''} scheduled for today
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No events scheduled for this day
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className={cn(
                    "p-3 rounded-lg border flex justify-between items-start",
                    event.completed && event.type === 'routine' && "bg-muted/50"
                  )}
                  style={{ 
                    borderLeftWidth: '4px',
                    borderLeftColor: event.color || '#9b87f5'
                  }}
                >
                  <div className="flex gap-2">
                    {event.type === 'routine' && (
                      <Checkbox 
                        checked={event.completed} 
                        onCheckedChange={() => toggleEventCompletion(event.id)}
                        className="mt-1"
                      />
                    )}
                    <div>
                      <h4 className={cn(
                        "font-medium",
                        event.completed && event.type === 'routine' && "line-through opacity-70"
                      )}>
                        {event.title}
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Badge 
                          variant="outline" 
                          className="mr-2"
                          style={{ 
                            backgroundColor: event.color || '#9b87f5',
                            color: event.color && isLightColor(event.color) ? 'black' : 'white'
                          }}
                        >
                          {event.type}
                        </Badge>
                        {event.time && <span>{event.time}</span>}
                      </div>
                      {event.description && (
                        <p className="mt-2 text-sm">{event.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEventToEdit(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEventToDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event from your calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {eventToEdit && (
        <EditEventDialog 
          event={eventToEdit} 
          isOpen={!!eventToEdit} 
          onClose={() => setEventToEdit(null)} 
        />
      )}
    </>
  );
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

export default EventList;
