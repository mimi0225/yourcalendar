import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, KeyRound, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const LoginForm = () => {
  const { login, signUp, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (!success) {
        setErrorMessage('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await signUp(signupEmail, signupPassword);
      if (!success) {
        setErrorMessage('Registration failed. This email may already be in use.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsResetLoading(true);
    try {
      const success = await resetPassword(resetEmail);
      if (success) {
        setResetDialogOpen(false);
        setResetEmail('');
      } else {
        setErrorMessage('Password reset failed. Please check your email address.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login">
        <CardHeader>
          <CardTitle>Account Access</CardTitle>
          <CardDescription>
            Sync your data across devices with an account.
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        {errorMessage && (
          <div className="px-6 -mt-2 mb-2">
            <p className="text-sm text-destructive">{errorMessage}</p>
          </div>
        )}
        
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-9"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <div className="text-right">
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-sm p-0 h-auto" type="button">
                      Forgot password?
                    </Button>
                  </DialogTrigger>
                </div>
                <DialogContent>
                  <form onSubmit={handleResetPassword}>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" />
                        Reset Password
                      </DialogTitle>
                      <DialogDescription>
                        Enter your email address below and we'll send you instructions to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-9"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isResetLoading}>
                        {isResetLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Instructions"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-9"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    className="pl-9"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    className="pl-9"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoginForm;
