
import { useCalendar, CalendarProvider } from '@/context/CalendarContext';
import CalendarHeader from '@/components/CalendarHeader';
import MonthView from '@/components/MonthView';
import DayView from '@/components/DayView';
import WeekView from '@/components/WeekView';
import EventList from '@/components/EventList';
import AddEventForm from '@/components/AddEventForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const CalendarApp = () => {
  const { selectedView, activeCalendarTheme } = useCalendar();
  
  return (
    <div className={`container max-w-7xl py-4 ${activeCalendarTheme}`}>
      <div className="flex justify-between items-center mb-4">
        <CalendarHeader />
        <Button asChild variant="outline">
          <Link to="/student">
            <GraduationCap className="mr-2 h-4 w-4" />
            Student
          </Link>
        </Button>
      </div>
      
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
