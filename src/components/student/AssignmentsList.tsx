
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Assignment } from '@/types/calendar';
import EditAssignmentDialog from './EditAssignmentDialog';

const AssignmentsList = () => {
  const { assignments, toggleAssignmentCompletion, deleteAssignment, getClassById } = useStudent();
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);
  
  // Sort assignments by due date
  const sortedAssignments = [...assignments].sort((a, b) => {
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
  
  const handleDeleteAssignment = () => {
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete);
      setAssignmentToDelete(null);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
          <CardDescription>
            {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} to complete
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No assignments added yet. Click "Add Assignment" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAssignments.map((assignment) => {
                const classItem = getClassById(assignment.classId);
                const isPastDue = new Date() > assignment.dueDate && !assignment.completed;
                
                return (
                  <div 
                    key={assignment.id}
                    className={cn(
                      "p-4 rounded-lg border flex justify-between items-start",
                      assignment.completed && "bg-muted/50",
                      isPastDue && "border-destructive border-opacity-50"
                    )}
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: classItem?.color || '#9b87f5'
                    }}
                  >
                    <div className="flex gap-2">
                      <Checkbox 
                        checked={assignment.completed} 
                        onCheckedChange={() => toggleAssignmentCompletion(assignment.id)}
                        className="mt-1"
                      />
                      <div>
                        <h3 className={cn(
                          "font-medium",
                          assignment.completed && "line-through opacity-70"
                        )}>
                          {assignment.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge 
                            variant="outline" 
                            className="capitalize"
                            style={{ 
                              backgroundColor: classItem?.color || '#9b87f5',
                              color: '#fff'
                            }}
                          >
                            {classItem?.name || 'Unknown Class'}
                          </Badge>
                          
                          <Badge variant="outline">
                            {assignment.type}
                          </Badge>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={cn(
                              isPastDue && "text-destructive font-medium"
                            )}>
                              Due {format(assignment.dueDate, 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          {assignment.weight && (
                            <Badge variant="secondary">
                              {assignment.weight}% of grade
                            </Badge>
                          )}
                        </div>
                        
                        {assignment.description && (
                          <p className={cn(
                            "mt-2 text-sm",
                            assignment.completed && "line-through opacity-70"
                          )}>
                            {assignment.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setAssignmentToEdit(assignment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setAssignmentToDelete(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!assignmentToDelete} onOpenChange={() => setAssignmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this assignment from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAssignment}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {assignmentToEdit && (
        <EditAssignmentDialog 
          assignment={assignmentToEdit} 
          isOpen={!!assignmentToEdit} 
          onClose={() => setAssignmentToEdit(null)} 
        />
      )}
    </>
  );
};

export default AssignmentsList;
