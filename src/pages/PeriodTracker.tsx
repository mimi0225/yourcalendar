
import React from 'react';
import { PeriodProvider } from '@/context/PeriodContext';
import PeriodTracker from '@/components/period/PeriodTracker';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, AlertTriangle, GraduationCap, Droplet, Trophy, Settings2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/context/SettingsContext';
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

const PeriodTrackerPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { tabSettings } = useSettings();
  
  return (
    <div className="container max-w-7xl py-4 min-h-screen flex flex-col">
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Period Tracker</h1>
            <p className="text-muted-foreground">
              Track and manage your cycle
            </p>
          </div>
        </div>
        
        {/* Mobile-optimized navigation tabs */}
        <div className="flex justify-center mt-4">
          <div className={`flex ${isMobile ? 'flex-wrap gap-2 justify-center' : 'gap-2'}`}>
            <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
              <Link to="/">
                <Calendar className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                {!isMobile && <span>Calendar</span>}
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
            
            <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
              <Link to="/period">
                <Droplet className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                {!isMobile && <span>Period</span>}
              </Link>
            </Button>
            
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
      
      {!isAuthenticated ? (
        <div className="my-8">
          <LoginForm />
        </div>
      ) : (
        <div className="flex-grow">
          <PeriodTracker />
        </div>
      )}
      
      {/* Logout section at bottom */}
      {isAuthenticated && (
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
                  Are you sure you want to log out? You will need to sign in again to access your tracker.
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
      )}
    </div>
  );
};

const PeriodTrackerWithProvider: React.FC = () => {
  return (
    <PeriodProvider>
      <PeriodTrackerPage />
    </PeriodProvider>
  );
};

export default PeriodTrackerWithProvider;
