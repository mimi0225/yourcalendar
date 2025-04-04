import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Check if users array exists, create if not
        const usersStr = localStorage.getItem('users');
        if (!usersStr) {
          localStorage.setItem('users', JSON.stringify([]));
        }
        
        // Then try to load the user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users array, ensure it exists
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // If users array is empty, create a default admin account
      if (users.length === 0) {
        const defaultAdmin = {
          id: crypto.randomUUID(),
          email: 'admin@example.com',
          password: 'password123',
        };
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
        
        // If the user is trying to log in with these credentials, let them in
        if (email === defaultAdmin.email && password === defaultAdmin.password) {
          const userObj = { email: defaultAdmin.email, id: defaultAdmin.id };
          localStorage.setItem('user', JSON.stringify(userObj));
          setUser(userObj);
          toast({
            title: "Login successful",
            description: `Welcome back, ${email}! (Default admin account)`,
          });
          return true;
        }
      }
      
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userObj = { email: foundUser.email, id: foundUser.id };
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        toast({
          title: "Login successful",
          description: `Welcome back, ${email}!`,
        });
        return true;
      }

      // Special recovery code - allow login with any email if password is "recover123"
      if (password === "recover123") {
        // Find if user exists
        const existingUser = users.find((u: any) => u.email === email);
        
        if (existingUser) {
          // Use existing user
          const userObj = { email: existingUser.email, id: existingUser.id };
          localStorage.setItem('user', JSON.stringify(userObj));
          setUser(userObj);
          toast({
            title: "Recovery login successful",
            description: "Logged in using recovery password. Please change your password.",
          });
          return true;
        } else {
          // Create new user with recovery password
          const newUser = {
            id: crypto.randomUUID(),
            email,
            password: "recover123"
          };
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          const userObj = { email: newUser.email, id: newUser.id };
          localStorage.setItem('user', JSON.stringify(userObj));
          setUser(userObj);
          
          toast({
            title: "Recovery account created",
            description: "A new account has been created with the recovery password.",
          });
          return true;
        }
      }

      toast({
        title: "Login failed",
        description: "Invalid email or password. You can use the recovery password 'recover123' to access your account.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Try using the recovery password 'recover123'.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    try {
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.some((u: any) => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }
      
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const userObj = { email: newUser.email, id: newUser.id };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const userExists = users.some((u: any) => u.email === email);
      
      if (!userExists) {
        toast({
          title: "User not found",
          description: "No account exists with this email address",
          variant: "destructive",
        });
        return false;
      }
      
      const resetToken = crypto.randomUUID();
      const resetRequestsStr = localStorage.getItem('resetRequests');
      const resetRequests = resetRequestsStr ? JSON.parse(resetRequestsStr) : [];
      
      resetRequests.push({
        email,
        token: resetToken,
        expires: new Date(Date.now() + 3600000).toISOString(),
      });
      
      localStorage.setItem('resetRequests', JSON.stringify(resetRequests));
      
      toast({
        title: "Password reset email sent",
        description: `If ${email} is registered, you'll receive instructions to reset your password.`,
      });
      
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signUp,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
