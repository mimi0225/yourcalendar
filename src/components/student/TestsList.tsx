
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
import { Calendar, Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Test } from '@/types/calendar';
import EditTestDialog from './EditTestDialog';

const TestsList = () => {
  const { tests, toggleTestCompletion, deleteTest, getClassById } = useStudent();
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [testToEdit, setTestToEdit] = useState<Test | null>(null);
  
  // Sort tests by date
  const sortedTests = [...tests].sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
  });
  
  const handleDeleteTest = () => {
    if (testToDelete) {
      deleteTest(testToDelete);
      setTestToDelete(null);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Tests</CardTitle>
          <CardDescription>
            {tests.length} test{tests.length !== 1 ? 's' : ''} scheduled
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {tests.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No tests added yet. Click "Add Test" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTests.map((test) => {
                const classItem = getClassById(test.classId);
                const isPastDue = new Date() > test.date && !test.completed;
                
                return (
                  <div 
                    key={test.id}
                    className={cn(
                      "p-4 rounded-lg border flex justify-between items-start",
                      test.completed && "bg-muted/50",
                      isPastDue && "border-destructive border-opacity-50"
                    )}
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: classItem?.color || '#9b87f5'
                    }}
                  >
                    <div className="flex gap-2">
                      <Checkbox 
                        checked={test.completed} 
                        onCheckedChange={() => toggleTestCompletion(test.id)}
                        className="mt-1"
                      />
                      <div>
                        <h3 className={cn(
                          "font-medium",
                          test.completed && "line-through opacity-70"
                        )}>
                          {test.title}
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
                          
                          <Badge variant="outline" className="capitalize">
                            {test.type}
                          </Badge>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={cn(
                              isPastDue && "text-destructive font-medium"
                            )}>
                              {format(test.date, 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          {test.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{test.time}</span>
                            </div>
                          )}
                          
                          {test.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{test.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {test.topics && test.topics.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Topics:</p>
                            <div className="flex flex-wrap gap-1">
                              {test.topics.map((topic, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setTestToEdit(test)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setTestToDelete(test.id)}
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
      
      <AlertDialog open={!!testToDelete} onOpenChange={() => setTestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this test from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTest}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {testToEdit && (
        <EditTestDialog 
          test={testToEdit} 
          isOpen={!!testToEdit} 
          onClose={() => setTestToEdit(null)} 
        />
      )}
    </>
  );
};

export default TestsList;
