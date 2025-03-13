
import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
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
import { TestType } from '@/types/calendar';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

const AddTestForm = () => {
  const { classes, addTest } = useStudent();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('');
  const [type, setType] = useState<TestType>('quiz');
  const [location, setLocation] = useState('');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  
  const resetForm = () => {
    setTitle('');
    setClassId('');
    setDate(new Date());
    setTime('');
    setType('quiz');
    setLocation('');
    setTopic('');
    setTopics([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTest({
      title,
      classId,
      date,
      time: time || undefined,
      type,
      location: location || undefined,
      topics: topics.length > 0 ? topics : undefined,
      completed: false,
    });
    
    setIsOpen(false);
    resetForm();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Test</DialogTitle>
          <DialogDescription>
            Enter the details of your test below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Test Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Midterm Exam"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            {classes.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Please add a class first before creating tests.
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
            <Label htmlFor="type">Test Type</Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as TestType)}
            >
              <SelectTrigger>
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
            <Label htmlFor="location">Location (optional)</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Science Building, Room 101"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topics">Topics (optional)</Label>
            <div className="flex space-x-2">
              <Input 
                id="topics" 
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
              Add Test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTestForm;
