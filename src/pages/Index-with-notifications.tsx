
import React from 'react';
import { CalendarProvider } from '@/context/CalendarContext';
import CalendarHeader from '@/components/CalendarHeader';
import MonthView from '@/components/MonthView';
import WeekView from '@/components/WeekView';
import DayView from '@/components/DayView';
import EventList from '@/components/EventList';
import AddEventForm from '@/components/AddEventForm';
import CalendarNotifications from '@/components/CalendarNotifications';

const Index = () => {
  return (
    <CalendarProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <CalendarHeader />
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <CalendarNotifications />
            <AddEventForm />
          </div>
        </div>
        
        <div className="calendar-content">
          <WeekView />
          <DayView />
          <MonthView />
          <EventList />
        </div>
      </div>
    </CalendarProvider>
  );
};

export default Index;
