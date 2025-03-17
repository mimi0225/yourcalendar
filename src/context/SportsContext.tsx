
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SportTeam, SportEvent, SportType } from '@/types/sports';
import { useToast } from '@/hooks/use-toast';

// Sample sport team colors
export const teamColorOptions = [
  { name: 'Red', value: '#FF6B6B' },
  { name: 'Blue', value: '#5C7AFF' },
  { name: 'Green', value: '#66BB6A' },
  { name: 'Orange', value: '#FFA726' },
  { name: 'Purple', value: '#9C27B0' },
  { name: 'Teal', value: '#26A69A' },
  { name: 'Yellow', value: '#FFEB3B' },
  { name: 'Pink', value: '#EC407A' },
];

// Sample teams
const sampleTeams: SportTeam[] = [
  {
    id: '1',
    name: 'Wildcats Basketball',
    type: 'school',
    color: '#FF6B6B',
    location: 'Main Gym',
    coach: 'Coach Johnson',
  },
  {
    id: '2',
    name: 'City Soccer Club',
    type: 'club',
    color: '#5C7AFF',
    location: 'Memorial Field',
    coach: 'Coach Rodriguez',
  },
];

// Sample events
const sampleEvents: SportEvent[] = [
  {
    id: '1',
    teamId: '1',
    title: 'Practice',
    eventType: 'practice',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '16:00',
    endTime: '18:00',
    location: 'Main Gym',
    notes: 'Bring extra water',
    completed: false,
  },
  {
    id: '2',
    teamId: '1',
    title: 'Game vs. Eagles',
    eventType: 'game',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    startTime: '19:00',
    endTime: '21:00',
    location: 'Away - Eagle High School',
    opponent: 'Eagles',
    notes: 'Bus leaves at 17:30',
    completed: false,
  },
];

interface SportsContextType {
  teams: SportTeam[];
  events: SportEvent[];
  addTeam: (team: Omit<SportTeam, 'id'>) => void;
  updateTeam: (team: SportTeam) => void;
  deleteTeam: (teamId: string) => void;
  addEvent: (event: Omit<SportEvent, 'id'>) => void;
  updateEvent: (event: SportEvent) => void;
  deleteEvent: (eventId: string) => void;
  toggleEventCompletion: (eventId: string) => void;
  getTeamById: (teamId: string) => SportTeam | undefined;
  getEventsByTeamId: (teamId: string) => SportEvent[];
  getUpcomingEvents: (days: number) => SportEvent[];
}

const SportsContext = createContext<SportsContextType | undefined>(undefined);

export const SportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<SportTeam[]>(sampleTeams);
  const [events, setEvents] = useState<SportEvent[]>(sampleEvents);
  const { toast } = useToast();

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    const savedTeams = localStorage.getItem('sportTeams');
    const savedEvents = localStorage.getItem('sportEvents');
    
    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams));
      } catch (error) {
        console.error('Failed to parse saved teams', error);
      }
    }
    
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error('Failed to parse saved events', error);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sportTeams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('sportEvents', JSON.stringify(events));
  }, [events]);

  const addTeam = (newTeam: Omit<SportTeam, 'id'>) => {
    const teamWithId = {
      ...newTeam,
      id: crypto.randomUUID(),
    };
    setTeams(prev => [...prev, teamWithId]);
    toast({
      title: "Team added",
      description: `"${newTeam.name}" has been added to your teams.`,
    });
  };

  const updateTeam = (updatedTeam: SportTeam) => {
    setTeams(prev => prev.map(team => 
      team.id === updatedTeam.id ? updatedTeam : team
    ));
    toast({
      title: "Team updated",
      description: `"${updatedTeam.name}" has been updated.`,
    });
  };

  const deleteTeam = (teamId: string) => {
    const teamToDelete = teams.find(t => t.id === teamId);
    setTeams(prev => prev.filter(team => team.id !== teamId));
    
    // Also delete all events for this team
    setEvents(prev => prev.filter(e => e.teamId !== teamId));
    
    if (teamToDelete) {
      toast({
        title: "Team deleted",
        description: `"${teamToDelete.name}" and its associated events have been removed.`,
      });
    }
  };

  const addEvent = (newEvent: Omit<SportEvent, 'id'>) => {
    const eventWithId = {
      ...newEvent,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, eventWithId]);
    toast({
      title: "Event added",
      description: `"${newEvent.title}" has been added to your sports schedule.`,
    });
  };

  const updateEvent = (updatedEvent: SportEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    toast({
      title: "Event updated",
      description: `"${updatedEvent.title}" has been updated.`,
    });
  };

  const deleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    setEvents(prev => prev.filter(event => event.id !== eventId));
    
    if (eventToDelete) {
      toast({
        title: "Event deleted",
        description: `"${eventToDelete.title}" has been removed.`,
      });
    }
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, completed: !event.completed } 
        : event
    ));
  };

  const getTeamById = (teamId: string) => {
    return teams.find(team => team.id === teamId);
  };

  const getEventsByTeamId = (teamId: string) => {
    return events.filter(event => event.teamId === teamId);
  };

  const getUpcomingEvents = (days: number = 7) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= futureDate;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  return (
    <SportsContext.Provider
      value={{
        teams,
        events,
        addTeam,
        updateTeam,
        deleteTeam,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventCompletion,
        getTeamById,
        getEventsByTeamId,
        getUpcomingEvents,
      }}
    >
      {children}
    </SportsContext.Provider>
  );
};

export const useSports = () => {
  const context = useContext(SportsContext);
  if (context === undefined) {
    throw new Error('useSports must be used within a SportsProvider');
  }
  return context;
};
