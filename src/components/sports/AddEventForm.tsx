
import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const AddEventForm = () => {
  const { teams, addEvent } = useSports();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [teamId, setTeamId] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [eventType, setEventType] = useState<'practice' | 'game' | 'tournament' | 'meeting' | 'other'>('practice');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [opponent, setOpponent] = useState('');
  const [notes, setNotes] = useState('');
  
  const resetForm = () => {
    setTitle('');
    setTeamId('');
    setDate(new Date());
    setEventType('practice');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setOpponent('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addEvent({
      teamId,
      title,
      eventType,
      date,
      startTime,
      endTime: endTime || undefined,
      location: location || undefined,
      opponent: opponent || undefined,
      notes: notes || undefined,
      completed: false,
    });
    
    setIsOpen(false);
    resetForm();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Sports Event</DialogTitle>
          <DialogDescription>
            Schedule a new practice or game for your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Practice" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            {teams.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Please add a team first before creating events.
              </div>
            ) : (
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
            )}
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
              placeholder="Main Gym"
            />
          </div>
          
          {(eventType === 'game' || eventType === 'tournament') && (
            <div className="space-y-2">
              <Label htmlFor="opponent">Opponent (optional)</Label>
              <Input 
                id="opponent" 
                value={opponent} 
                onChange={(e) => setOpponent(e.target.value)} 
                placeholder="Eagles"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Any additional information about this event"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={teams.length === 0}>
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventForm;
