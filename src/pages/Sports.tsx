
import React from 'react';
import { SportsProvider, useSports } from '@/context/SportsContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/context/SettingsContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SportsCalendar from '@/components/sports/SportsCalendar';
import TeamsList from '@/components/sports/TeamsList';
import EventsList from '@/components/sports/EventsList';
import AddTeamForm from '@/components/sports/AddTeamForm';
import AddEventForm from '@/components/sports/AddEventForm';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, GraduationCap, Trophy, LayoutGrid, LogOut, AlertTriangle, Droplet, Settings2 } from 'lucide-react';
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

const SportsPage = () => {
  const { teams } = useSports();
  const { user, logout, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { tabSettings } = useSettings();
  
  return (
    <div className="container max-w-7xl py-4 min-h-screen flex flex-col">
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Sports Tracker</h1>
            <p className="text-muted-foreground">
              Track your sports teams, practices, and games
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
            
            {tabSettings.period && (
              <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
                <Link to="/period">
                  <Droplet className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                  {!isMobile && <span>Period</span>}
                </Link>
              </Button>
            )}
            
            <Button asChild variant="outline" size={isMobile ? "sm" : "lg"} className="mb-1">
              <Link to="/sports">
                <Trophy className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                {!isMobile && <span>Sports</span>}
              </Link>
            </Button>
            
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
        <>
          <Tabs defaultValue="overview" className="flex-grow">
            <TabsList className={`mb-6 flex ${isMobile ? 'flex-wrap' : 'justify-center'}`}>
              <TabsTrigger value="overview">
                <LayoutGrid className="mr-1 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="teams">
                <Trophy className="mr-1 h-4 w-4" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="mr-1 h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <SportsCalendar />
            </TabsContent>
            
            <TabsContent value="teams" className="space-y-4">
              <div className="flex justify-end">
                <AddTeamForm />
              </div>
              <TeamsList />
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              <div className="flex justify-end">
                <AddEventForm />
              </div>
              <EventsList />
            </TabsContent>
          </Tabs>
          
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
                    Are you sure you want to log out? You will need to sign in again to access your tracker.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>Log Out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {/* Logged in status at bottom */}
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

const SportsWithProvider = () => {
  return (
    <SportsProvider>
      <SportsPage />
    </SportsProvider>
  );
};

export default SportsWithProvider;
