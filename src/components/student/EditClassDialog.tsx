
import { useState, useEffect } from 'react';
import { useStudent, classColorOptions } from '@/context/StudentContext';
import { Class, ClassPriority } from '@/types/calendar';
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
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface EditClassDialogProps {
  classItem: Class;
  isOpen: boolean;
  onClose: () => void;
}

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const EditClassDialog = ({ classItem, isOpen, onClose }: EditClassDialogProps) => {
  const { updateClass } = useStudent();
  const [name, setName] = useState(classItem.name);
  const [instructor, setInstructor] = useState(classItem.instructor);
  const [location, setLocation] = useState(classItem.location || '');
  const [days, setDays] = useState<string[]>(classItem.days);
  const [startTime, setStartTime] = useState(classItem.startTime || '');
  const [endTime, setEndTime] = useState(classItem.endTime || '');
  const [color, setColor] = useState(classItem.color);
  const [priority, setPriority] = useState<ClassPriority>(classItem.priority);
  
  useEffect(() => {
    if (isOpen) {
      setName(classItem.name);
      setInstructor(classItem.instructor);
      setLocation(classItem.location || '');
      setDays(classItem.days);
      setStartTime(classItem.startTime || '');
      setEndTime(classItem.endTime || '');
      setColor(classItem.color);
      setPriority(classItem.priority);
    }
  }, [classItem, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateClass({
      ...classItem,
      name,
      instructor,
      location: location || undefined,
      days,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      color,
      priority,
    });
    
    onClose();
  };

  const handleDayToggle = (day: string) => {
    setDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Make changes to your class details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Class Name</Label>
            <Input 
              id="edit-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Introduction to Computer Science"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-instructor">Instructor</Label>
            <Input 
              id="edit-instructor" 
              value={instructor} 
              onChange={(e) => setInstructor(e.target.value)} 
              placeholder="Professor Smith"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-location">Location (optional)</Label>
            <Input 
              id="edit-location" 
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
                    id={`edit-day-${day}`} 
                    checked={days.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <label
                    htmlFor={`edit-day-${day}`}
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
              <Label htmlFor="edit-start-time">Start Time (optional)</Label>
              <Input 
                id="edit-start-time" 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-end-time">End Time (optional)</Label>
              <Input 
                id="edit-end-time" 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-priority">Priority</Label>
            <Select 
              value={priority} 
              onValueChange={(value) => setPriority(value as ClassPriority)}
            >
              <SelectTrigger id="edit-priority">
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

export default EditClassDialog;
