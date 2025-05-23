
import { useCalendar, CalendarProvider } from '@/context/CalendarContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import CalendarHeader from '@/components/CalendarHeader';
import MonthView from '@/components/MonthView';
import DayView from '@/components/DayView';
import WeekView from '@/components/WeekView';
import EventList from '@/components/EventList';
import AddEventForm from '@/components/AddEventForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap, LogOut, AlertTriangle, Droplet, Trophy, Settings2, Clipboard, DollarSign } from 'lucide-react';
import CalendarNotifications from '@/components/CalendarNotifications';
import LoginForm from '@/components/auth/LoginForm';
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

const CalendarApp = () => {
  const { selectedView, activeCalendarTheme } = useCalendar();
  const { user, logout, isAuthenticated } = useAuth();
  const { tabSettings } = useSettings();
  const isMobile = useIsMobile();
  
  return (
    <div className={`container max-w-7xl py-4 ${activeCalendarTheme} min-h-screen flex flex-col`}>
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center">
          <CalendarHeader />
        </div>
        
        {/* Mobile-optimized navigation tabs */}
        <div className="flex justify-center mt-4">
          <div className={`flex ${isMobile ? 'flex-wrap gap-2 justify-center' : 'gap-2'}`}>
            <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
              <Link to="/">
                <span className="font-medium">Calendar</span>
              </Link>
            </Button>
            
            {tabSettings.student && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/student">
                  <GraduationCap className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Student</span>}
                </Link>
              </Button>
            )}
            
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
            
            {tabSettings.chores && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/chores">
                  <Clipboard className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Chores</span>}
                </Link>
              </Button>
            )}
            
            {tabSettings.budget && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/budget">
                  <DollarSign className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Budget</span>}
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
      
      <CalendarNotifications />
      
      {!isAuthenticated ? (
        <div className="my-8">
          <LoginForm />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
            <div className="lg:col-span-2">
              {selectedView === 'month' && <MonthView />}
              {selectedView === 'week' && <WeekView />}
              {selectedView === 'day' && <DayView />}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-end">
                <AddEventForm />
              </div>
              <EventList />
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
        </>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  );
};

export default Index;
