
import { useState, useEffect } from 'react';
import { useStudent } from '@/context/StudentContext';
import { Assignment, AssignmentType } from '@/types/calendar';
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
import { Checkbox } from '@/components/ui/checkbox';

interface EditAssignmentDialogProps {
  assignment: Assignment;
  isOpen: boolean;
  onClose: () => void;
}

const EditAssignmentDialog = ({ assignment, isOpen, onClose }: EditAssignmentDialogProps) => {
  const { classes, updateAssignment } = useStudent();
  const [title, setTitle] = useState(assignment.title);
  const [classId, setClassId] = useState(assignment.classId);
  const [dueDate, setDueDate] = useState<Date>(assignment.dueDate);
  const [type, setType] = useState<AssignmentType>(assignment.type);
  const [description, setDescription] = useState(assignment.description || '');
  const [weight, setWeight] = useState<number | undefined>(assignment.weight);
  const [completed, setCompleted] = useState(assignment.completed);
  
  useEffect(() => {
    if (isOpen) {
      setTitle(assignment.title);
      setClassId(assignment.classId);
      setDueDate(assignment.dueDate);
      setType(assignment.type);
      setDescription(assignment.description || '');
      setWeight(assignment.weight);
      setCompleted(assignment.completed);
    }
  }, [assignment, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateAssignment({
      ...assignment,
      title,
      classId,
      dueDate,
      type,
      description: description || undefined,
      weight,
      completed,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Make changes to your assignment details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Assignment Title</Label>
            <Input 
              id="edit-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Programming Exercise 2"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-class">Class</Label>
            <Select 
              value={classId} 
              onValueChange={setClassId}
              required
            >
              <SelectTrigger id="edit-class">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-type">Assignment Type</Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as AssignmentType)}
            >
              <SelectTrigger id="edit-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homework">Homework</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="paper">Paper</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-weight">Weight (% of grade, optional)</Label>
            <Input 
              id="edit-weight" 
              type="number" 
              min="0"
              max="100"
              value={weight || ''} 
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)} 
              placeholder="10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea 
              id="edit-description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Complete exercises 2.1-2.5 from the textbook"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="edit-completed" 
              checked={completed}
              onCheckedChange={(checked) => setCompleted(checked === true)}
            />
            <label
              htmlFor="edit-completed"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Mark as completed
            </label>
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

export default EditAssignmentDialog;
