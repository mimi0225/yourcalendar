
import { useState } from 'react';
import { useStudent, classColorOptions } from '@/context/StudentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ClassPriority } from '@/types/calendar';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const AddClassForm = () => {
  const { addClass } = useStudent();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [location, setLocation] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('#9b87f5');
  const [priority, setPriority] = useState<ClassPriority>('medium');
  
  const resetForm = () => {
    setName('');
    setInstructor('');
    setLocation('');
    setDays([]);
    setStartTime('');
    setEndTime('');
    setColor('#9b87f5');
    setPriority('medium');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addClass({
      name,
      instructor,
      location,
      days,
      startTime,
      endTime,
      color,
      priority,
    });
    
    setIsOpen(false);
    resetForm();
  };

  const handleDayToggle = (day: string) => {
    setDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Enter the details of your class to add it to your schedule.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Introduction to Computer Science"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input 
              id="instructor" 
              value={instructor} 
              onChange={(e) => setInstructor(e.target.value)} 
              placeholder="Professor Smith"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Building 101, Room 302"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Days</Label>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day}`} 
                    checked={days.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <label
                    htmlFor={`day-${day}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {day.substring(0, 3)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time (optional)</Label>
              <Input 
                id="start-time" 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time (optional)</Label>
              <Input 
                id="end-time" 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={priority} 
              onValueChange={(value) => setPriority(value as ClassPriority)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {classColorOptions.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    color === colorOption.value ? "ring-2 ring-ring ring-offset-2" : ""
                  )}
                  style={{ backgroundColor: colorOption.value }}
                  onClick={() => setColor(colorOption.value)}
                  aria-label={`Select ${colorOption.name} color`}
                />
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
            <Button type="submit">Add Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassForm;
