
import React, { useState } from 'react';
import { useBlackboard } from '@/context/BlackboardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Loader2, RefreshCw, Link as LinkIcon, Unlink, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const BlackboardConnect: React.FC = () => {
  const { 
    calendarConnection, 
    isConnecting, 
    connectToCalendar, 
    disconnectFromCalendar,
    syncCalendarEvents,
    isSyncing,
    lastSynced
  } = useBlackboard();
  
  const [calendarUrl, setCalendarUrl] = useState('');
  const [calendarName, setCalendarName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleConnect = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!calendarUrl) {
      toast({
        title: "Error",
        description: "Please enter a calendar URL",
        variant: "destructive",
      });
      return;
    }
    
    await connectToCalendar(calendarUrl, calendarName);
    setDialogOpen(false);
  };

  const handleDisconnect = () => {
    disconnectFromCalendar();
  };

  return (
    <div className="bg-card border rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Calendar Integration
      </h3>
      
      {calendarConnection ? (
        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Connected to:</span>
              <span className="font-semibold">{calendarConnection.name}</span>
              <span className="text-sm text-muted-foreground break-all">{calendarConnection.url}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {lastSynced 
                ? `Last synced ${formatDistanceToNow(lastSynced, { addSuffix: true })}` 
                : 'Not synced yet'}
            </span>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncCalendarEvents}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </>
              )}
            </Button>
          </div>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleDisconnect}
          >
            <Unlink className="mr-2 h-4 w-4" />
            Disconnect Calendar
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect to your calendar by adding a URL (iCal, Google Calendar, etc.) to automatically sync assignments, tests, and projects.
          </p>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect Calendar
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Calendar</DialogTitle>
                <DialogDescription>
                  Enter your calendar URL to sync your assignments, tests and projects.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleConnect} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="calendarName">Calendar Name</Label>
                  <Input
                    id="calendarName"
                    placeholder="e.g., School Calendar, Google Calendar"
                    value={calendarName}
                    onChange={(e) => setCalendarName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="calendarUrl">Calendar URL</Label>
                  <Input
                    id="calendarUrl"
                    placeholder="https://calendar.google.com/calendar/ical/..."
                    value={calendarUrl}
                    onChange={(e) => setCalendarUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter an iCal URL from Google Calendar, Outlook, or any other calendar service.
                  </p>
                </div>
                
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default BlackboardConnect;
