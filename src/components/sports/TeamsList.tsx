
import React, { useState } from 'react';
import { useSports } from '@/context/SportsContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPin, User, Pencil, Trash2 } from 'lucide-react';
import { SportTeam } from '@/types/sports';
import EditTeamDialog from './EditTeamDialog';

const TeamsList = () => {
  const { teams, deleteTeam } = useSports();
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [teamToEdit, setTeamToEdit] = useState<SportTeam | null>(null);
  
  const handleDeleteTeam = () => {
    if (teamToDelete) {
      deleteTeam(teamToDelete);
      setTeamToDelete(null);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Teams</CardTitle>
          <CardDescription>
            {teams.length} team{teams.length !== 1 ? 's' : ''} registered
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {teams.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No teams added yet. Click "Add Team" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <div 
                  key={team.id}
                  className="p-4 rounded-lg border flex justify-between items-start"
                  style={{ 
                    borderLeftWidth: '4px',
                    borderLeftColor: team.color
                  }}
                >
                  <div>
                    <h3 className="font-medium">{team.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Badge 
                        variant="outline" 
                        className="capitalize"
                      >
                        {team.type}
                      </Badge>
                      
                      {team.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{team.location}</span>
                        </div>
                      )}
                      
                      {team.coach && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Coach: {team.coach}</span>
                        </div>
                      )}
                    </div>
                    
                    {team.notes && (
                      <p className="mt-2 text-sm">
                        {team.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setTeamToEdit(team)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setTeamToDelete(team.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!teamToDelete} onOpenChange={() => setTeamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this team and all associated events.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeam}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {teamToEdit && (
        <EditTeamDialog 
          team={teamToEdit} 
          isOpen={!!teamToEdit} 
          onClose={() => setTeamToEdit(null)} 
        />
      )}
    </>
  );
};

export default TeamsList;
