
import { useState, useEffect } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { CalendarEvent, EventType } from '@/types/calendar';
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

interface EditEventDialogProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

const EditEventDialog = ({ event, isOpen, onClose }: EditEventDialogProps) => {
  const { updateEvent } = useCalendar();
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState<Date>(event.date);
  const [eventType, setEventType] = useState<EventType>(event.type);
  const [time, setTime] = useState(event.time || '');
  const [description, setDescription] = useState(event.description || '');
  const [color, setColor] = useState(event.color || '#9b87f5');
  
  useEffect(() => {
    if (isOpen) {
      setTitle(event.title);
      setDate(event.date);
      setEventType(event.type);
      setTime(event.time || '');
      setDescription(event.description || '');
      setColor(event.color || '#9b87f5');
    }
  }, [event, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateEvent({
      ...event,
      title,
      date,
      type: eventType,
      time: time || undefined,
      description: description || undefined,
      color,
    });
    
    onClose();
  };
  
  const eventColors = [
    { label: 'Lavender', value: '#9b87f5' },
    { label: 'Mint', value: '#8BE8CB' },
    { label: 'Peach', value: '#FEC6A1' },
    { label: 'Rose', value: '#FFDEE2' },
    { label: 'Sky', value: '#D3E4FD' },
    { label: 'Lemon', value: '#FEF7CD' },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Make changes to your event details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input 
              id="edit-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-type">Event Type</Label>
            <Select 
              value={eventType} 
              onValueChange={(value) => setEventType(value as EventType)}
            >
              <SelectTrigger id="edit-type">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time (optional)</Label>
              <Input 
                id="edit-time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea 
              id="edit-description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add details about this event"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {eventColors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    color === colorOption.value ? "ring-2 ring-ring ring-offset-2" : ""
                  )}
                  style={{ backgroundColor: colorOption.value }}
                  onClick={() => setColor(colorOption.value)}
                  aria-label={`Select ${colorOption.label} color`}
                ></button>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
