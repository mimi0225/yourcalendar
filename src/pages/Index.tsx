
import { useCalendar, CalendarProvider } from '@/context/CalendarContext';
import { useAuth } from '@/context/AuthContext';
import CalendarHeader from '@/components/CalendarHeader';
import MonthView from '@/components/MonthView';
import DayView from '@/components/DayView';
import WeekView from '@/components/WeekView';
import EventList from '@/components/EventList';
import AddEventForm from '@/components/AddEventForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import CalendarNotifications from '@/components/CalendarNotifications';
import LoginForm from '@/components/auth/LoginForm';

const CalendarApp = () => {
  const { selectedView, activeCalendarTheme } = useCalendar();
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <div className={`container max-w-7xl py-4 ${activeCalendarTheme}`}>
      <div className="flex justify-between items-center mb-4">
        <CalendarHeader />
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
            <Link to="/student">
              <GraduationCap className="mr-2 h-4 w-4" />
              Student
            </Link>
          </Button>
        </div>
      </div>
      
      <CalendarNotifications />
      
      {!isAuthenticated ? (
        <div className="my-8">
          <LoginForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
