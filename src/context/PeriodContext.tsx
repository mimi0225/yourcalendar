import React, { createContext, useContext, useState, useEffect } from 'react';
import { PeriodEntry, CycleData, PeriodStats, Symptom, FlowLevel } from '@/types/period';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format, isSameDay } from 'date-fns';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PeriodContextType {
  periodEntries: PeriodEntry[];
  cycleData: CycleData;
  addPeriodEntry: (entry: Omit<PeriodEntry, 'id'>) => void;
  updatePeriodEntry: (id: string, updates: Partial<Omit<PeriodEntry, 'id'>>) => void;
  deletePeriodEntry: (id: string) => void;
  getEntryForDate: (date: Date) => PeriodEntry | undefined;
  calculateStats: () => PeriodStats;
  isPeriodDay: (date: Date) => boolean;
  isPrivate: boolean;
  togglePrivacy: () => void;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const PeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [periodEntries, setPeriodEntries] = useState<PeriodEntry[]>([]);
  const [cycleData, setCycleData] = useState<CycleData>({
    cycleLength: 28,
    periodLength: 5,
  });
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    if (user) {
      const userId = user.email?.replace(/[^a-zA-Z0-9]/g, '') || 'anonymous';
      const savedEntries = localStorage.getItem(`periodEntries_${userId}`);
      const savedCycleData = localStorage.getItem(`cycleData_${userId}`);
      const savedPrivacy = localStorage.getItem(`periodPrivacy_${userId}`);
      
      if (savedEntries) {
        try {
          const parsed = JSON.parse(savedEntries);
          setPeriodEntries(parsed.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          })));
        } catch (error) {
          console.error('Error parsing period entries:', error);
        }
      }
      
      if (savedCycleData) {
        try {
          const parsed = JSON.parse(savedCycleData);
          setCycleData({
            ...parsed,
            lastPeriodStart: parsed.lastPeriodStart ? new Date(parsed.lastPeriodStart) : undefined,
            nextPeriodPrediction: parsed.nextPeriodPrediction ? new Date(parsed.nextPeriodPrediction) : undefined
          });
        } catch (error) {
          console.error('Error parsing cycle data:', error);
        }
      }
      
      if (savedPrivacy) {
        setIsPrivate(JSON.parse(savedPrivacy));
      }
    }
  }, [user]);
  
  // Save data to localStorage
  useEffect(() => {
    if (user && periodEntries.length > 0) {
      const userId = user.email?.replace(/[^a-zA-Z0-9]/g, '') || 'anonymous';
      localStorage.setItem(`periodEntries_${userId}`, JSON.stringify(periodEntries));
    }
  }, [periodEntries, user]);
  
  useEffect(() => {
    if (user) {
      const userId = user.email?.replace(/[^a-zA-Z0-9]/g, '') || 'anonymous';
      localStorage.setItem(`cycleData_${userId}`, JSON.stringify(cycleData));
    }
  }, [cycleData, user]);
  
  useEffect(() => {
    if (user) {
      const userId = user.email?.replace(/[^a-zA-Z0-9]/g, '') || 'anonymous';
      localStorage.setItem(`periodPrivacy_${userId}`, JSON.stringify(isPrivate));
    }
  }, [isPrivate, user]);

  const addPeriodEntry = (entry: Omit<PeriodEntry, 'id'>) => {
    const newEntry: PeriodEntry = {
      id: uuidv4(),
      ...entry,
      date: new Date(entry.date),
    };
    setPeriodEntries([...periodEntries, newEntry]);
    toast({
      title: "Period entry added.",
      description: "Your entry has been successfully added.",
    })
  };

  const updatePeriodEntry = (id: string, updates: Partial<Omit<PeriodEntry, 'id'>>) => {
    setPeriodEntries(periodEntries.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          ...updates,
          date: updates.date ? new Date(updates.date) : entry.date,
        };
      }
      return entry;
    }));
    toast({
      title: "Period entry updated.",
      description: "Your entry has been successfully updated.",
    })
  };

  const deletePeriodEntry = (id: string) => {
    setPeriodEntries(periodEntries.filter(entry => entry.id !== id));
    toast({
      title: "Period entry deleted.",
      description: "Your entry has been successfully deleted.",
    })
  };

  const getEntryForDate = (date: Date): PeriodEntry | undefined => {
    return periodEntries.find(entry => isSameDay(new Date(entry.date), date));
  };

  const calculateStats = (): PeriodStats => {
    const cycleLengths: number[] = [];
    const periodLengths: number[] = [];
    const symptomsMap: { [key: string]: number } = {};

    for (let i = 1; i < periodEntries.length; i++) {
      const endDate = new Date(periodEntries[i].date);
      const startDate = new Date(periodEntries[i - 1].date);
      const cycleLength = Math.abs(Number(endDate) - Number(startDate)) / (1000 * 60 * 60 * 24);
      cycleLengths.push(cycleLength);
    }

    periodEntries.forEach(entry => {
      periodLengths.push(cycleData.periodLength);
      entry.symptoms.forEach(symptom => {
        symptomsMap[symptom] = (symptomsMap[symptom] || 0) + 1;
      });
    });

    const averageCycleLength = cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
      : 28;

    const averagePeriodLength = periodLengths.length > 0
      ? Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)
      : 5;

    const sortedSymptoms = Object.entries(symptomsMap)
      .sort(([, a], [, b]) => b - a)
      .map(([symptom]) => symptom)
      .slice(0, 3);

    return {
      averageCycleLength,
      averagePeriodLength,
      commonSymptoms: sortedSymptoms as Symptom[],
    };
  };

  const isPeriodDay = (date: Date): boolean => {
    if (!cycleData.lastPeriodStart) return false;

    const startDate = new Date(cycleData.lastPeriodStart);
    for (let i = 0; i < cycleData.periodLength; i++) {
      const periodDay = addDays(startDate, i);
      if (isSameDay(date, periodDay)) {
        return true;
      }
    }
    return false;
  };

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
    toast({
      title: "Privacy settings updated.",
      description: `Period tracker is now ${!isPrivate ? 'public' : 'private'}.`,
    })
  };

  const value: PeriodContextType = {
    periodEntries,
    cycleData,
    addPeriodEntry,
    updatePeriodEntry,
    deletePeriodEntry,
    getEntryForDate,
    calculateStats,
    isPeriodDay,
    isPrivate,
    togglePrivacy,
  };

  return (
    <PeriodContext.Provider value={value}>
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (context === undefined) {
    throw new Error('usePeriod must be used within a PeriodProvider');
  }
  return context;
};
