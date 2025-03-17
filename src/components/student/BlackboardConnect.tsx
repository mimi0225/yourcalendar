
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
import { Loader2, RefreshCw, Link as LinkIcon, Unlink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const BlackboardConnect: React.FC = () => {
  const { 
    blackboardUser, 
    isConnecting, 
    connectToBlackboard, 
    disconnectFromBlackboard,
    syncAssignments,
    isSyncing,
    lastSynced
  } = useBlackboard();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConnect = async (event: React.FormEvent) => {
    event.preventDefault();
    await connectToBlackboard(username, password, institution);
    setDialogOpen(false);
  };

  const handleDisconnect = () => {
    disconnectFromBlackboard();
  };

  return (
    <div className="bg-card border rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <LinkIcon className="h-5 w-5" />
        Blackboard Integration
      </h3>
      
      {blackboardUser ? (
        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Connected to:</span>
              <span className="font-semibold">{blackboardUser.institution}</span>
              <span className="text-sm text-muted-foreground">{blackboardUser.email}</span>
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
              onClick={syncAssignments}
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
            Disconnect Blackboard
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect to your university's Blackboard system to automatically sync assignments, tests, and due dates.
          </p>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect to Blackboard
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect to Blackboard</DialogTitle>
                <DialogDescription>
                  Enter your Blackboard credentials to sync your assignments and tests.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleConnect} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">University/Institution</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., Stanford University"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your Blackboard username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your Blackboard password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your credentials are stored locally and used only to connect to Blackboard.
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
