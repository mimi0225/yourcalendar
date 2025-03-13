
import { useStudent, StudentProvider } from '@/context/StudentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassesList from '@/components/student/ClassesList';
import AssignmentsList from '@/components/student/AssignmentsList';
import TestsList from '@/components/student/TestsList';
import AddClassForm from '@/components/student/AddClassForm';
import AddAssignmentForm from '@/components/student/AddAssignmentForm';
import AddTestForm from '@/components/student/AddTestForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, GraduationCap } from 'lucide-react';

const StudentPage = () => {
  const { classes } = useStudent();
  
  return (
    <div className="container max-w-7xl py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your classes, assignments, and tests
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="classes">
        <TabsList className="mb-6">
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-end">
            <AddClassForm />
          </div>
          <ClassesList />
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-end">
            <AddAssignmentForm />
          </div>
          <AssignmentsList />
        </TabsContent>
        
        <TabsContent value="tests" className="space-y-4">
          <div className="flex justify-end">
            <AddTestForm />
          </div>
          <TestsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Student = () => {
  return (
    <StudentProvider>
      <StudentPage />
    </StudentProvider>
  );
};

export default Student;
