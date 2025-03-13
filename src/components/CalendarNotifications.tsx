
import React, { useEffect } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import NotificationPermission from './NotificationPermission';
import { toast } from '@/hooks/use-toast';

const CalendarNotifications = () => {
  const { events } = useCalendar();

  useEffect(() => {
    // Schedule notifications for upcoming events
    const checkUpcomingEvents = () => {
      if (Notification.permission !== 'granted') return;
      
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Find events in the next 24 hours
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= tomorrow;
      });
      
      // Send notification for each upcoming event (in a real app, you'd probably want to batch these)
      upcomingEvents.forEach(event => {
        const timeUntilEvent = new Date(event.date).getTime() - now.getTime();
        
        // Only notify if the event is soon but not already passed
        if (timeUntilEvent > 0 && timeUntilEvent < 24 * 60 * 60 * 1000) {
          // For this example, we'll simulate a push by showing a standard notification
          // In a production app, you'd register with a push service
          if ('serviceWorker' in navigator && 'PushManager' in window) {
            // This would be your server-side push notification in a real app
            // Here we're just simulating with a direct notification
            new Notification(`Upcoming: ${event.title}`, {
              body: event.time ? `Today at ${event.time}` : 'Today',
              icon: '/favicon.ico'
            });
          }
        }
      });
    };
    
    // Check for upcoming events every 30 minutes
    const intervalId = setInterval(checkUpcomingEvents, 30 * 60 * 1000);
    
    // Initial check
    checkUpcomingEvents();
    
    return () => clearInterval(intervalId);
  }, [events]);
  
  const handlePermissionChange = (permission: NotificationPermission) => {
    if (permission === 'granted') {
      // You could store this preference in your CalendarContext or localStorage
      localStorage.setItem('notificationsEnabled', 'true');
    }
  };
  
  return (
    <div className="flex items-center justify-end mb-4">
      <NotificationPermission onPermissionChange={handlePermissionChange} />
    </div>
  );
};

export default CalendarNotifications;
