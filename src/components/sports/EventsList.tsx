
import React, { useState } from 'react';
import { useSports } from '@/context/SportsContext';
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
import { Calendar, MapPin, Users, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SportEvent } from '@/types/sports';
import EditEventDialog from './EditEventDialog';

const EventsList = () => {
  const { events, getTeamById, toggleEventCompletion, deleteEvent } = useSports();
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<SportEvent | null>(null);
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
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
          <CardTitle>Your Sports Events</CardTitle>
          <CardDescription>
            {events.length} event{events.length !== 1 ? 's' : ''} scheduled
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No events added yet. Click "Add Event" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event) => {
                const team = getTeamById(event.teamId);
                const isPastEvent = new Date() > new Date(event.date);
                
                return (
                  <div 
                    key={event.id}
                    className={cn(
                      "p-4 rounded-lg border flex justify-between items-start",
                      event.completed && "bg-muted/50"
                    )}
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: team?.color || '#9b87f5'
                    }}
                  >
                    <div className="flex gap-2">
                      <Checkbox 
                        checked={event.completed} 
                        onCheckedChange={() => toggleEventCompletion(event.id)}
                        className="mt-1"
                      />
                      <div>
                        <h3 className={cn(
                          "font-medium",
                          event.completed && "line-through opacity-70"
                        )}>
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge 
                            variant="outline" 
                            className="capitalize"
                            style={{ 
                              backgroundColor: team?.color || '#9b87f5',
                              color: '#fff'
                            }}
                          >
                            {team?.name || 'Unknown Team'}
                          </Badge>
                          
                          <Badge variant="outline" className="capitalize">
                            {event.eventType}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(event.date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          <span>
                            {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                          </span>
                          
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.opponent && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>vs. {event.opponent}</span>
                            </div>
                          )}
                        </div>
                        
                        {event.notes && (
                          <p className={cn(
                            "mt-2 text-sm",
                            event.completed && "line-through opacity-70"
                          )}>
                            {event.notes}
                          </p>
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event from your sports schedule.
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

export default EventsList;
