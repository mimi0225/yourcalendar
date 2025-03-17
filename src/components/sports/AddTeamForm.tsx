
import { useState } from 'react';
import { useSports } from '@/context/SportsContext';
import { sportColorOptions } from '@/types/sports';
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
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SportType } from '@/types/sports';

const AddTeamForm = () => {
  const { addTeam } = useSports();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<SportType>('school');
  const [color, setColor] = useState('#FF6B6B');
  const [location, setLocation] = useState('');
  const [coach, setCoach] = useState('');
  const [notes, setNotes] = useState('');
  
  const resetForm = () => {
    setName('');
    setType('school');
    setColor('#FF6B6B');
    setLocation('');
    setCoach('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTeam({
      name,
      type,
      color,
      location,
      coach,
      notes,
    });
    
    setIsOpen(false);
    resetForm();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
          <DialogDescription>
            Enter the details of your team below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Wildcats Basketball"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Team Type</Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as SportType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="club">Club</SelectItem>
                <SelectItem value="recreational">Recreational</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Practice Location (optional)</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Main Gym"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coach">Coach Name (optional)</Label>
            <Input 
              id="coach" 
              value={coach} 
              onChange={(e) => setCoach(e.target.value)} 
              placeholder="Coach Johnson"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Any additional information about the team"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Team Color</Label>
            <div className="flex flex-wrap gap-2">
              {sportColorOptions.map((colorOption) => (
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
            <Button type="submit">Add Team</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamForm;
