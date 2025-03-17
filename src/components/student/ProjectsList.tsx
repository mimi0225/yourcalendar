
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
import { 
  Calendar, 
  Pencil, 
  Trash2, 
  Users,
  CheckSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Project } from '@/types/calendar';
import EditProjectDialog from './EditProjectDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const ProjectsList = () => {
  const { projects, toggleProjectCompletion, deleteProject, getClassById } = useStudent();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  
  // Sort projects by due date
  const sortedProjects = [...projects].sort((a, b) => {
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
  
  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  const calculateProgress = (project: Project) => {
    if (project.milestones.length === 0) return 0;
    const completedCount = project.milestones.filter(m => m.completed).length;
    return Math.round((completedCount / project.milestones.length) * 100);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>
            {projects.length} project{projects.length !== 1 ? 's' : ''} in progress
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No projects added yet. Sync with Blackboard to import your projects.
            </div>
          ) : (
            <div className="space-y-6">
              {sortedProjects.map((project) => {
                const classItem = getClassById(project.classId);
                const isPastDue = new Date() > project.dueDate && !project.completed;
                const progress = calculateProgress(project);
                
                return (
                  <div 
                    key={project.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      project.completed && "bg-muted/50",
                      isPastDue && "border-destructive border-opacity-50"
                    )}
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: classItem?.color || '#9b87f5'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Checkbox 
                          checked={project.completed} 
                          onCheckedChange={() => toggleProjectCompletion(project.id)}
                          className="mt-1"
                        />
                        <div className="space-y-2 w-full">
                          <h3 className={cn(
                            "font-medium",
                            project.completed && "line-through opacity-70"
                          )}>
                            {project.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
                              {project.type} project
                            </Badge>
                            
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span className={cn(
                                isPastDue && "text-destructive font-medium"
                              )}>
                                Due {format(project.dueDate, 'MMM d, yyyy')}
                              </span>
                            </div>
                            
                            {project.weight && (
                              <Badge variant="secondary">
                                {project.weight}% of grade
                              </Badge>
                            )}
                          </div>
                          
                          {project.description && (
                            <p className={cn(
                              "text-sm",
                              project.completed && "line-through opacity-70"
                            )}>
                              {project.description}
                            </p>
                          )}

                          {project.teamMembers && project.teamMembers.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Team: {project.teamMembers.join(', ')}
                              </span>
                            </div>
                          )}

                          {project.milestones && project.milestones.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Project Progress</span>
                                <span className="text-sm text-muted-foreground">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              
                              <Table className="mt-2">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[30px]"></TableHead>
                                    <TableHead>Milestone</TableHead>
                                    <TableHead>Due Date</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {project.milestones.map((milestone, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <Checkbox 
                                          checked={milestone.completed} 
                                          onCheckedChange={() => {
                                            // This would need to be implemented in StudentContext
                                            // For now it's read-only
                                          }}
                                          disabled={project.completed}
                                        />
                                      </TableCell>
                                      <TableCell className={cn(
                                        milestone.completed && "line-through opacity-70"
                                      )}>
                                        {milestone.title}
                                      </TableCell>
                                      <TableCell>
                                        {format(milestone.dueDate, 'MMM d, yyyy')}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setProjectToEdit(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setProjectToDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this project from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {projectToEdit && (
        <EditProjectDialog 
          project={projectToEdit} 
          isOpen={!!projectToEdit} 
          onClose={() => setProjectToEdit(null)} 
        />
      )}
    </>
  );
};

export default ProjectsList;
