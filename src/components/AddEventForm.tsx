
import { useState } from 'react';
import { useCalendar } from '@/context/CalendarContext';
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
import { EventType } from '@/types/calendar';

const AddEventForm = () => {
  const { selectedDate, addEvent, themeOptions } = useCalendar();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>(selectedDate);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('reminder');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#9b87f5');
  
  const resetForm = () => {
    setTitle('');
    setEventType('reminder');
    setTime('');
    setDescription('');
    setColor('#9b87f5');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addEvent({
      title,
      date,
      type: eventType,
      time,
      description,
      color,
    });
    
    setIsOpen(false);
    resetForm();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event, reminder or routine task for your calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-type">Event Type</Label>
            <Select 
              value={eventType} 
              onValueChange={(value) => setEventType(value as EventType)}
            >
              <SelectTrigger>
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
              <Label htmlFor="time">Time (optional)</Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
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
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventForm;
