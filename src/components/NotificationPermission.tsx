
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

interface NotificationPermissionProps {
  onPermissionChange: (permission: NotificationPermission) => void;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({ onPermissionChange }) => {
  // Check if Notification API is available
  const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window;
  
  const requestPermission = async () => {
    if (!isNotificationSupported) return;
    
    try {
      const permission = await Notification.requestPermission();
      onPermissionChange(permission);
      
      if (permission === 'granted') {
        new Notification('Notifications Enabled', {
          body: 'You will now receive calendar reminders',
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };
  
  if (!isNotificationSupported) {
    return null; // Don't render if notifications aren't supported
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={requestPermission}
      className="flex items-center gap-1"
    >
      <Bell className="h-4 w-4" />
      <span>Enable Notifications</span>
    </Button>
  );
};

export default NotificationPermission;
