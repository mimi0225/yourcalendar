
import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
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
import { AssignmentType } from '@/types/calendar';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const AddAssignmentForm = () => {
  const { classes, addAssignment } = useStudent();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [type, setType] = useState<AssignmentType>('homework');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState<number | undefined>(undefined);
  
  const resetForm = () => {
    setTitle('');
    setClassId('');
    setDueDate(new Date());
    setType('homework');
    setDescription('');
    setWeight(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addAssignment({
      title,
      classId,
      dueDate,
      type,
      description,
      weight,
      completed: false,
    });
    
    setIsOpen(false);
    resetForm();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Assignment</DialogTitle>
          <DialogDescription>
            Enter the details of your assignment below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Programming Exercise 2"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            {classes.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Please add a class first before creating assignments.
              </div>
            ) : (
              <Select 
                value={classId} 
                onValueChange={setClassId}
                required
              >
                <SelectTrigger>
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
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Assignment Type</Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as AssignmentType)}
            >
              <SelectTrigger>
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
            <Label htmlFor="weight">Weight (% of grade, optional)</Label>
            <Input 
              id="weight" 
              type="number" 
              min="0"
              max="100"
              value={weight || ''} 
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)} 
              placeholder="10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Complete exercises 2.1-2.5 from the textbook"
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
            <Button type="submit" disabled={classes.length === 0}>
              Add Assignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentForm;
