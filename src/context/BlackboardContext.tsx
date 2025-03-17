
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useStudent } from './StudentContext';
import { Assignment, Test, Project } from '@/types/calendar';

interface BlackboardUser {
  id: string;
  username: string;
  email: string;
  institution: string;
  isConnected: boolean;
}

interface BlackboardContextType {
  blackboardUser: BlackboardUser | null;
  isConnecting: boolean;
  lastSynced: Date | null;
  connectToBlackboard: (username: string, password: string, institution: string) => Promise<void>;
  disconnectFromBlackboard: () => void;
  syncAssignments: () => Promise<void>;
  isSyncing: boolean;
}

const BlackboardContext = createContext<BlackboardContextType | undefined>(undefined);

export const BlackboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blackboardUser, setBlackboardUser] = useState<BlackboardUser | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const { toast } = useToast();
  const { addAssignment, addTest, addProject } = useStudent();

  // Load saved connection from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('blackboardUser');
    if (savedUser) {
      try {
        setBlackboardUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved Blackboard user', error);
      }
    }

    const savedLastSynced = localStorage.getItem('blackboardLastSynced');
    if (savedLastSynced) {
      try {
        setLastSynced(new Date(JSON.parse(savedLastSynced)));
      } catch (error) {
        console.error('Failed to parse last synced date', error);
      }
    }
  }, []);

  // Save connection to localStorage when it changes
  useEffect(() => {
    if (blackboardUser) {
      localStorage.setItem('blackboardUser', JSON.stringify(blackboardUser));
    } else {
      localStorage.removeItem('blackboardUser');
    }
  }, [blackboardUser]);

  // Save last synced date to localStorage
  useEffect(() => {
    if (lastSynced) {
      localStorage.setItem('blackboardLastSynced', JSON.stringify(lastSynced.toISOString()));
    }
  }, [lastSynced]);

  const connectToBlackboard = async (username: string, password: string, institution: string) => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would make an API call to authenticate with Blackboard
      // For demo purposes, we're simulating a successful connection
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const newUser: BlackboardUser = {
        id: crypto.randomUUID(),
        username,
        email: `${username}@${institution.toLowerCase().replace(/\s+/g, '')}.edu`,
        institution,
        isConnected: true
      };
      
      setBlackboardUser(newUser);
      toast({
        title: "Connected to Blackboard",
        description: `Successfully connected to ${institution} Blackboard as ${username}`,
      });
      
      // After connecting, automatically sync assignments
      await syncAssignments();
    } catch (error) {
      console.error('Failed to connect to Blackboard', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Blackboard. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromBlackboard = () => {
    setBlackboardUser(null);
    toast({
      title: "Disconnected from Blackboard",
      description: "Your Blackboard account has been disconnected.",
    });
  };

  const syncAssignments = async () => {
    if (!blackboardUser) {
      toast({
        title: "Not Connected",
        description: "Please connect to Blackboard before syncing assignments.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    
    try {
      // In a real implementation, this would make an API call to fetch assignments from Blackboard
      // For demo purposes, we're simulating fetching and adding assignments
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Generate some sample assignments based on the user's institution
      const sampleAssignments = generateSampleAssignments(blackboardUser.institution);
      const sampleTests = generateSampleTests(blackboardUser.institution);
      const sampleProjects = generateSampleProjects(blackboardUser.institution);
      
      // Add the assignments to the student context
      sampleAssignments.forEach(assignment => {
        addAssignment(assignment);
      });
      
      // Add the tests to the student context
      sampleTests.forEach(test => {
        addTest(test);
      });

      // Add the projects to the student context
      sampleProjects.forEach(project => {
        addProject(project);
      });
      
      setLastSynced(new Date());
      toast({
        title: "Sync Complete",
        description: `Added ${sampleAssignments.length} assignments, ${sampleTests.length} tests, and ${sampleProjects.length} projects from Blackboard.`,
      });
    } catch (error) {
      console.error('Failed to sync from Blackboard', error);
      toast({
        title: "Sync Failed",
        description: "Could not sync from Blackboard. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <BlackboardContext.Provider
      value={{
        blackboardUser,
        isConnecting,
        lastSynced,
        connectToBlackboard,
        disconnectFromBlackboard,
        syncAssignments,
        isSyncing,
      }}
    >
      {children}
    </BlackboardContext.Provider>
  );
};

export const useBlackboard = () => {
  const context = useContext(BlackboardContext);
  if (context === undefined) {
    throw new Error('useBlackboard must be used within a BlackboardProvider');
  }
  return context;
};

// Helper functions to generate sample data
const generateSampleAssignments = (institution: string): Omit<Assignment, 'id'>[] => {
  const classes = ['CS101', 'MATH201', 'BIO110', 'HIST300', 'ECON250'];
  const assignmentTypes: Assignment['type'][] = ['homework', 'paper', 'presentation'];
  
  return Array(Math.floor(Math.random() * 3) + 2).fill(null).map(() => {
    const classPrefix = classes[Math.floor(Math.random() * classes.length)];
    return {
      title: `${classPrefix} - ${['Assignment', 'Homework'][Math.floor(Math.random() * 2)]} ${Math.floor(Math.random() * 10) + 1}`,
      classId: crypto.randomUUID(), // In a real app, this would map to an actual class ID
      dueDate: new Date(Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000), // Random due date in the next 14 days
      type: assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)],
      description: `Assignment from ${institution} Blackboard`,
      completed: false,
      weight: Math.floor(Math.random() * 15) + 5, // Random weight between 5-20%
    };
  });
};

const generateSampleTests = (institution: string): Omit<Test, 'id'>[] => {
  const classes = ['CS101', 'MATH201', 'BIO110', 'HIST300', 'ECON250'];
  const testTypes: Test['type'][] = ['quiz', 'midterm', 'final', 'test'];
  
  return Array(Math.floor(Math.random() * 2) + 1).fill(null).map(() => {
    const classPrefix = classes[Math.floor(Math.random() * classes.length)];
    return {
      title: `${classPrefix} - ${testTypes[Math.floor(Math.random() * testTypes.length)]}`,
      classId: crypto.randomUUID(), // In a real app, this would map to an actual class ID
      date: new Date(Date.now() + (Math.floor(Math.random() * 21) + 7) * 24 * 60 * 60 * 1000), // Random date in the next 7-28 days
      time: `${Math.floor(Math.random() * 4) + 9}:00`, // Random time between 9:00 and 13:00
      type: testTypes[Math.floor(Math.random() * testTypes.length)],
      location: `${['Building', 'Hall', 'Room'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 400) + 100}`,
      topics: ['Topic 1', 'Topic 2', 'Topic 3'].slice(0, Math.floor(Math.random() * 3) + 1),
      completed: false,
    };
  });
};

const generateSampleProjects = (institution: string): Omit<Project, 'id'>[] => {
  const classes = ['CS101', 'MATH201', 'BIO110', 'HIST300', 'ECON250'];
  const projectTypes: Project['type'][] = ['individual', 'group', 'research'];
  
  return Array(Math.floor(Math.random() * 2) + 1).fill(null).map(() => {
    const classPrefix = classes[Math.floor(Math.random() * classes.length)];
    const hasTeamMembers = Math.random() > 0.5;
    
    return {
      title: `${classPrefix} - ${['Final Project', 'Term Project', 'Research Project'][Math.floor(Math.random() * 3)]}`,
      classId: crypto.randomUUID(),
      dueDate: new Date(Date.now() + (Math.floor(Math.random() * 30) + 10) * 24 * 60 * 60 * 1000), // Random due date in the next 10-40 days
      type: projectTypes[Math.floor(Math.random() * projectTypes.length)],
      description: `Project from ${institution} Blackboard`,
      teamMembers: hasTeamMembers ? ['Student 1', 'Student 2', 'Student 3'].slice(0, Math.floor(Math.random() * 3) + 1) : [],
      milestones: [
        { 
          title: 'Proposal', 
          dueDate: new Date(Date.now() + (Math.floor(Math.random() * 7) + 3) * 24 * 60 * 60 * 1000),
          completed: Math.random() > 0.7
        },
        { 
          title: 'Draft', 
          dueDate: new Date(Date.now() + (Math.floor(Math.random() * 14) + 10) * 24 * 60 * 60 * 1000),
          completed: false
        }
      ],
      completed: false,
      weight: Math.floor(Math.random() * 20) + 15, // Random weight between 15-35%
    };
  });
};
