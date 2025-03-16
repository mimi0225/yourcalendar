
import React from 'react';
import { PeriodProvider } from '@/context/PeriodContext';
import PeriodTracker from '@/components/period/PeriodTracker';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
  
  return (
    <div className="container max-w-7xl py-4 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Period Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your cycle
          </p>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground mr-2">Logged in as:</span>
                <span className="font-medium">{user.email}</span>
              </div>
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
        <div className="mt-auto pt-6 border-t border-border flex justify-center">
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
