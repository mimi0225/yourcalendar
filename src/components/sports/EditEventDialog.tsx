
import { useState, useEffect } from 'react';
import { useSports } from '@/context/SportsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SportEvent } from '@/types/sports';

interface EditEventDialogProps {
  event: SportEvent;
  isOpen: boolean;
  onClose: () => void;
}

const EditEventDialog = ({ event, isOpen, onClose }: EditEventDialogProps) => {
  const { teams, updateEvent } = useSports();
  const [title, setTitle] = useState(event.title);
  const [teamId, setTeamId] = useState(event.teamId);
  const [date, setDate] = useState<Date>(new Date(event.date));
  const [eventType, setEventType] = useState<'practice' | 'game' | 'tournament' | 'meeting' | 'other'>(event.eventType);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime || '');
  const [location, setLocation] = useState(event.location || '');
  const [opponent, setOpponent] = useState(event.opponent || '');
  const [notes, setNotes] = useState(event.notes || '');
  
  // Update form when event changes
  useEffect(() => {
    setTitle(event.title);
    setTeamId(event.teamId);
    setDate(new Date(event.date));
    setEventType(event.eventType);
    setStartTime(event.startTime);
    setEndTime(event.endTime || '');
    setLocation(event.location || '');
    setOpponent(event.opponent || '');
    setNotes(event.notes || '');
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateEvent({
      ...event,
      teamId,
      title,
      eventType,
      date,
      startTime,
      endTime: endTime || undefined,
      location: location || undefined,
      opponent: opponent || undefined,
      notes: notes || undefined,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the details of your sports event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select 
              value={teamId} 
              onValueChange={setTeamId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type</Label>
            <Select 
              value={eventType} 
              onValueChange={(value) => setEventType(value as 'practice' | 'game' | 'tournament' | 'meeting' | 'other')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="game">Game</SelectItem>
                <SelectItem value="tournament">Tournament</SelectItem>
                <SelectItem value="meeting">Team Meeting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input 
                id="startTime" 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time (optional)</Label>
              <Input 
                id="endTime" 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>
          
          {(eventType === 'game' || eventType === 'tournament') && (
            <div className="space-y-2">
              <Label htmlFor="opponent">Opponent (optional)</Label>
              <Input 
                id="opponent" 
                value={opponent} 
                onChange={(e) => setOpponent(e.target.value)} 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
