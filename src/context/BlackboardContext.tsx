
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useStudent } from './StudentContext';
import { Assignment, Test, Project } from '@/types/calendar';

interface CalendarConnection {
  id: string;
  url: string;
  name: string;
  isConnected: boolean;
}

interface BlackboardContextType {
  calendarConnection: CalendarConnection | null;
  isConnecting: boolean;
  lastSynced: Date | null;
  connectToCalendar: (url: string, name: string) => Promise<void>;
  disconnectFromCalendar: () => void;
  syncCalendarEvents: () => Promise<void>;
  isSyncing: boolean;
}

const BlackboardContext = createContext<BlackboardContextType | undefined>(undefined);

export const BlackboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calendarConnection, setCalendarConnection] = useState<CalendarConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const { toast } = useToast();
  const { addAssignment, addTest, addProject } = useStudent();

  // Load saved connection from localStorage
  useEffect(() => {
    const savedConnection = localStorage.getItem('calendarConnection');
    if (savedConnection) {
      try {
        setCalendarConnection(JSON.parse(savedConnection));
      } catch (error) {
        console.error('Failed to parse saved calendar connection', error);
      }
    }

    const savedLastSynced = localStorage.getItem('calendarLastSynced');
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
    if (calendarConnection) {
      localStorage.setItem('calendarConnection', JSON.stringify(calendarConnection));
    } else {
      localStorage.removeItem('calendarConnection');
    }
  }, [calendarConnection]);

  // Save last synced date to localStorage
  useEffect(() => {
    if (lastSynced) {
      localStorage.setItem('calendarLastSynced', JSON.stringify(lastSynced.toISOString()));
    }
  }, [lastSynced]);

  const connectToCalendar = async (url: string, name: string) => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would validate the calendar URL and fetch data
      // For demo purposes, we're simulating a successful connection
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const newConnection: CalendarConnection = {
        id: crypto.randomUUID(),
        url,
        name: name || 'My Calendar',
        isConnected: true
      };
      
      setCalendarConnection(newConnection);
      toast({
        title: "Connected to Calendar",
        description: `Successfully connected to ${name || 'calendar'}`,
      });
      
      // After connecting, automatically sync events
      await syncCalendarEvents();
    } catch (error) {
      console.error('Failed to connect to calendar', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the calendar. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromCalendar = () => {
    setCalendarConnection(null);
    toast({
      title: "Disconnected from Calendar",
      description: "Your calendar has been disconnected.",
    });
  };

  const syncCalendarEvents = async () => {
    if (!calendarConnection) {
      toast({
        title: "Not Connected",
        description: "Please connect to a calendar before syncing events.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    
    try {
      // In a real implementation, this would fetch and parse the calendar feed
      // For demo purposes, we're simulating fetching and adding events
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Generate some sample assignments, tests, and projects based on the calendar name
      const sampleAssignments = generateSampleAssignments(calendarConnection.name);
      const sampleTests = generateSampleTests(calendarConnection.name);
      const sampleProjects = generateSampleProjects(calendarConnection.name);
      
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
        description: `Added ${sampleAssignments.length} assignments, ${sampleTests.length} tests, and ${sampleProjects.length} projects from calendar.`,
      });
    } catch (error) {
      console.error('Failed to sync from calendar', error);
      toast({
        title: "Sync Failed",
        description: "Could not sync from calendar. Please check the URL and try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <BlackboardContext.Provider
      value={{
        calendarConnection,
        isConnecting,
        lastSynced,
        connectToCalendar,
        disconnectFromCalendar,
        syncCalendarEvents,
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

// Helper functions to generate sample data (these remain mostly the same)
const generateSampleAssignments = (calendarName: string): Omit<Assignment, 'id'>[] => {
  const classes = ['CS101', 'MATH201', 'BIO110', 'HIST300', 'ECON250'];
  const assignmentTypes: Assignment['type'][] = ['homework', 'paper', 'presentation'];
  
  return Array(Math.floor(Math.random() * 3) + 2).fill(null).map(() => {
    const classPrefix = classes[Math.floor(Math.random() * classes.length)];
    return {
      title: `${classPrefix} - ${['Assignment', 'Homework'][Math.floor(Math.random() * 2)]} ${Math.floor(Math.random() * 10) + 1}`,
      classId: crypto.randomUUID(), // In a real app, this would map to an actual class ID
      dueDate: new Date(Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000), // Random due date in the next 14 days
      type: assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)],
      description: `Assignment from ${calendarName}`,
      completed: false,
      weight: Math.floor(Math.random() * 15) + 5, // Random weight between 5-20%
    };
  });
};

const generateSampleTests = (calendarName: string): Omit<Test, 'id'>[] => {
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

const generateSampleProjects = (calendarName: string): Omit<Project, 'id'>[] => {
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
      description: `Project from ${calendarName}`,
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
