
import { useStudent, StudentProvider } from '@/context/StudentContext';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassesList from '@/components/student/ClassesList';
import AssignmentsList from '@/components/student/AssignmentsList';
import TestsList from '@/components/student/TestsList';
import StudentCalendar from '@/components/student/StudentCalendar';
import AddClassForm from '@/components/student/AddClassForm';
import AddAssignmentForm from '@/components/student/AddAssignmentForm';
import AddTestForm from '@/components/student/AddTestForm';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, GraduationCap, Clock, BookOpen, LayoutGrid, LogOut } from 'lucide-react';

const StudentPage = () => {
  const { classes } = useStudent();
  const { user, logout } = useAuth();
  
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
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground mr-2">Logged in as:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : null}
          <Button asChild variant="outline">
            <Link to="/">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </Button>
        </div>
      </div>
      
      {!user ? (
        <div className="my-8">
          <LoginForm />
        </div>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <LayoutGrid className="mr-1 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="classes">
              <GraduationCap className="mr-1 h-4 w-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <BookOpen className="mr-1 h-4 w-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="tests">
              <Clock className="mr-1 h-4 w-4" />
              Tests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <StudentCalendar />
          </TabsContent>
          
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
      )}
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
