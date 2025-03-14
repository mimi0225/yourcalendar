
import React, { useState, useEffect } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import NotificationPermission from './NotificationPermission';

const CalendarNotifications = () => {
  const [permissionState, setPermissionState] = useState<NotificationPermission | null>(null);
  const { events } = useCalendar();
  const { toast } = useToast();
  
  // Check if Notification API is available
  const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    // Only run this if Notification API is available
    if (!isNotificationSupported) return;
    
    // Check permission status
    setPermissionState(Notification.permission);
    
    // Schedule notifications for upcoming events
    if (Notification.permission === 'granted') {
      scheduleNotifications();
    }
  }, [events]);
  
  const scheduleNotifications = () => {
    // Return if notifications aren't supported
    if (!isNotificationSupported) return;
    
    const tomorrow = addDays(new Date(), 1);
    const tomorrowEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return format(eventDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
    });
    
    if (tomorrowEvents.length > 0) {
      // Show a toast notification for demo purposes
      toast({
        title: "Upcoming Events",
        description: `You have ${tomorrowEvents.length} event(s) tomorrow.`,
      });
      
      // Actually schedule the notification
      if (isNotificationSupported) {
        setTimeout(() => {
          try {
            new Notification("Calendar Reminder", {
              body: `You have ${tomorrowEvents.length} event(s) scheduled for tomorrow.`,
              icon: "/favicon.ico"
            });
          } catch (error) {
            console.error("Failed to create notification:", error);
          }
        }, 5000); // 5 seconds delay for demo
      }
    }
  };
  
  if (!isNotificationSupported) {
    return null; // Don't render anything if notifications aren't supported
  }
  
  return (
    <div>
      {permissionState !== 'granted' && (
        <NotificationPermission onPermissionChange={setPermissionState} />
      )}
    </div>
  );
};

export default CalendarNotifications;
