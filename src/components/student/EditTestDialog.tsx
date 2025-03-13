
import { useState, useEffect } from 'react';
import { useStudent } from '@/context/StudentContext';
import { Test, TestType } from '@/types/calendar';
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
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface EditTestDialogProps {
  test: Test;
  isOpen: boolean;
  onClose: () => void;
}

const EditTestDialog = ({ test, isOpen, onClose }: EditTestDialogProps) => {
  const { classes, updateTest } = useStudent();
  const [title, setTitle] = useState(test.title);
  const [classId, setClassId] = useState(test.classId);
  const [date, setDate] = useState<Date>(test.date);
  const [time, setTime] = useState(test.time || '');
  const [type, setType] = useState<TestType>(test.type);
  const [location, setLocation] = useState(test.location || '');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState<string[]>(test.topics || []);
  const [completed, setCompleted] = useState(test.completed);
  
  useEffect(() => {
    if (isOpen) {
      setTitle(test.title);
      setClassId(test.classId);
      setDate(test.date);
      setTime(test.time || '');
      setType(test.type);
      setLocation(test.location || '');
      setTopic('');
      setTopics(test.topics || []);
      setCompleted(test.completed);
    }
  }, [test, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateTest({
      ...test,
      title,
      classId,
      date,
      time: time || undefined,
      type,
      location: location || undefined,
      topics: topics.length > 0 ? topics : undefined,
      completed,
    });
    
    onClose();
  };

  const handleAddTopic = () => {
    if (topic.trim() && !topics.includes(topic.trim())) {
      setTopics([...topics, topic.trim()]);
      setTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(topics.filter(t => t !== topicToRemove));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Test</DialogTitle>
          <DialogDescription>
            Make changes to your test details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Test Title</Label>
            <Input 
              id="edit-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Midterm Exam"
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
            <Label htmlFor="edit-type">Test Type</Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as TestType)}
            >
              <SelectTrigger id="edit-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="midterm">Midterm</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
            <Label htmlFor="edit-location">Location (optional)</Label>
            <Input 
              id="edit-location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Science Building, Room 101"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-topics">Topics (optional)</Label>
            <div className="flex space-x-2">
              <Input 
                id="edit-topics" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="Add a topic"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTopic}>Add</Button>
            </div>
            
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {topics.map((t, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {t}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTopic(t)}
                      className="hover:text-destructive focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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

export default EditTestDialog;
