
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPermissionProps {
  onPermissionChange?: (permission: NotificationPermission) => void;
}

const NotificationPermission = ({ onPermissionChange }: NotificationPermissionProps) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      return;
    }

    // Get current permission status
    setPermission(Notification.permission);
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (onPermissionChange) {
        onPermissionChange(result);
      }
      
      if (result === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive notifications for upcoming events.",
        });
      } else if (result === 'denied') {
        toast({
          title: "Notifications blocked",
          description: "You'll need to enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission request failed",
        description: "There was a problem requesting notification permissions.",
        variant: "destructive",
      });
    }
  };

  // If notifications are not supported, don't render anything
  if (!('Notification' in window)) {
    return null;
  }

  return (
    <Button
      variant={permission === 'granted' ? "outline" : "default"}
      size="sm"
      onClick={requestPermission}
      className="gap-2"
    >
      {permission === 'granted' ? (
        <>
          <Bell className="h-4 w-4" />
          Notifications On
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          Enable Notifications
        </>
      )}
    </Button>
  );
};

export default NotificationPermission;
