
import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
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
import { Clock, GraduationCap, MapPin, Pencil, Trash2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Class } from '@/types/calendar';
import EditClassDialog from './EditClassDialog';

const ClassesList = () => {
  const { classes, deleteClass } = useStudent();
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [classToEdit, setClassToEdit] = useState<Class | null>(null);
  
  const handleDeleteClass = () => {
    if (classToDelete) {
      deleteClass(classToDelete);
      setClassToDelete(null);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Classes</CardTitle>
          <CardDescription>
            {classes.length} class{classes.length !== 1 ? 'es' : ''} registered
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {classes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No classes added yet. Click "Add Class" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {classes.map((cls) => (
                <div 
                  key={cls.id}
                  className="p-4 rounded-lg border"
                  style={{ 
                    borderLeftWidth: '4px',
                    borderLeftColor: cls.color
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-lg">{cls.name}</h3>
                        <Badge
                          variant={cls.priority === 'high' ? 'destructive' : cls.priority === 'medium' ? 'default' : 'outline'}
                        >
                          {cls.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{cls.instructor}</span>
                        </div>
                        
                        {cls.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{cls.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {cls.startTime && cls.endTime ? `${cls.startTime} - ${cls.endTime}` : 'No time specified'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          {cls.days.map((day) => (
                            <Badge key={day} variant="outline">{day.substring(0, 3)}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setClassToEdit(cls)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setClassToDelete(cls.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!classToDelete} onOpenChange={() => setClassToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this class and all its associated assignments and tests.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClass}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {classToEdit && (
        <EditClassDialog 
          classItem={classToEdit} 
          isOpen={!!classToEdit} 
          onClose={() => setClassToEdit(null)} 
        />
      )}
    </>
  );
};

export default ClassesList;
