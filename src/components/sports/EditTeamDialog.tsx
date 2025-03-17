
import { useState, useEffect } from 'react';
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
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { SportTeam, SportType } from '@/types/sports';

interface EditTeamDialogProps {
  team: SportTeam;
  isOpen: boolean;
  onClose: () => void;
}

const EditTeamDialog = ({ team, isOpen, onClose }: EditTeamDialogProps) => {
  const { updateTeam } = useSports();
  const [name, setName] = useState(team.name);
  const [type, setType] = useState<SportType>(team.type);
  const [color, setColor] = useState(team.color);
  const [location, setLocation] = useState(team.location || '');
  const [coach, setCoach] = useState(team.coach || '');
  const [notes, setNotes] = useState(team.notes || '');
  
  // Update form when team changes
  useEffect(() => {
    setName(team.name);
    setType(team.type);
    setColor(team.color);
    setLocation(team.location || '');
    setCoach(team.coach || '');
    setNotes(team.notes || '');
  }, [team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateTeam({
      ...team,
      name,
      type,
      color,
      location: location || undefined,
      coach: coach || undefined,
      notes: notes || undefined,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update your team's details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coach">Coach Name (optional)</Label>
            <Input 
              id="coach" 
              value={coach} 
              onChange={(e) => setCoach(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Team</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamDialog;
