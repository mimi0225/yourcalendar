
import { StudentProvider } from '@/context/StudentContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { GraduationCap, LogOut, AlertTriangle, Droplet, Trophy, Calendar, Settings2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/context/SettingsContext';
import ClassesList from '@/components/student/ClassesList';
import AssignmentsList from '@/components/student/AssignmentsList';
import TestsList from '@/components/student/TestsList';
import ProjectsList from '@/components/student/ProjectsList';
import StudentCalendar from '@/components/student/StudentCalendar';
import BlackboardConnect from '@/components/student/BlackboardConnect';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const StudentContent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { tabSettings } = useSettings();

  if (!isAuthenticated) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
        <p className="mb-4 text-muted-foreground">Please log in to access your student dashboard.</p>
        <Button asChild>
          <Link to="/">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-4 min-h-screen flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        
        {/* Mobile-optimized navigation tabs */}
        <div className="flex justify-center mt-4">
          <div className={`flex ${isMobile ? 'flex-wrap gap-2 justify-center' : 'gap-2'}`}>
            <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
              <Link to="/">
                <Calendar className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                {!isMobile && <span>Calendar</span>}
              </Link>
            </Button>
            <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
              <Link to="/student">
                <GraduationCap className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                {!isMobile && <span>Student</span>}
              </Link>
            </Button>
            
            {tabSettings.period && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/period">
                  <Droplet className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Period</span>}
                </Link>
              </Button>
            )}
            
            {tabSettings.sports && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/sports">
                  <Trophy className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Sports</span>}
                </Link>
              </Button>
            )}
            
            {tabSettings.settings && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/settings">
                  <Settings2 className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Settings</span>}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="classes">
            <TabsList className={`w-full ${isMobile ? 'flex flex-wrap' : 'grid grid-cols-5'}`}>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="classes" className="mt-4">
              <ClassesList />
            </TabsContent>
            <TabsContent value="assignments" className="mt-4">
              <AssignmentsList />
            </TabsContent>
            <TabsContent value="tests" className="mt-4">
              <TestsList />
            </TabsContent>
            <TabsContent value="projects" className="mt-4">
              <ProjectsList />
            </TabsContent>
            <TabsContent value="calendar" className="mt-4">
              <StudentCalendar />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <BlackboardConnect />
        </div>
      </div>

      {/* Logout section at bottom */}
      <div className="mt-auto pt-6 border-t border-border flex flex-col items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="lg" className="w-full max-w-md">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Confirm Logout
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? You will need to sign in again to access your calendar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Log Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Moved logged in status to bottom */}
        {user && (
          <div className="mt-4 text-sm text-center">
            <span className="text-muted-foreground">Logged in as: </span>
            <span className="font-medium">{user.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Student = () => {
  return (
    <StudentProvider>
      <StudentContent />
    </StudentProvider>
  );
};

export default Student;
