
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PeriodEntry, FlowLevel, Symptom, CycleData, PeriodStats } from '@/types/period';
import { addDays, differenceInDays, subDays, isSameDay, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface PeriodContextType {
  periodEntries: PeriodEntry[];
  cycleData: CycleData;
  addPeriodEntry: (entry: Omit<PeriodEntry, 'id'>) => void;
  updatePeriodEntry: (entry: PeriodEntry) => void;
  deletePeriodEntry: (id: string) => void;
  getEntryForDate: (date: Date) => PeriodEntry | undefined;
  updateCycleData: (data: Partial<CycleData>) => void;
  calculateStats: () => PeriodStats;
  isPeriodDay: (date: Date) => boolean;
  predictNextPeriod: () => void;
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
  const { toast } = useToast();
  const { user } = useAuth();

  // Load saved data from localStorage when the component mounts
  useEffect(() => {
    if (user) {
      const savedEntries = localStorage.getItem(`periodEntries_${user.uid}`);
      const savedCycleData = localStorage.getItem(`cycleData_${user.uid}`);
      const savedPrivacy = localStorage.getItem(`periodPrivacy_${user.uid}`);
      
      if (savedEntries) {
        try {
          const parsedEntries = JSON.parse(savedEntries);
          // Convert string dates back to Date objects
          const entriesWithDates = parsedEntries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setPeriodEntries(entriesWithDates);
        } catch (error) {
          console.error('Failed to parse saved period entries', error);
        }
      }
      
      if (savedCycleData) {
        try {
          const parsedCycleData = JSON.parse(savedCycleData);
          setCycleData({
            ...parsedCycleData,
            lastPeriodStart: parsedCycleData.lastPeriodStart ? new Date(parsedCycleData.lastPeriodStart) : undefined,
            nextPeriodPrediction: parsedCycleData.nextPeriodPrediction ? new Date(parsedCycleData.nextPeriodPrediction) : undefined,
          });
        } catch (error) {
          console.error('Failed to parse saved cycle data', error);
        }
      }
      
      if (savedPrivacy) {
        setIsPrivate(JSON.parse(savedPrivacy));
      }
    }
  }, [user]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`periodEntries_${user.uid}`, JSON.stringify(periodEntries));
      localStorage.setItem(`cycleData_${user.uid}`, JSON.stringify(cycleData));
      localStorage.setItem(`periodPrivacy_${user.uid}`, JSON.stringify(isPrivate));
    }
  }, [periodEntries, cycleData, isPrivate, user]);

  const addPeriodEntry = (entry: Omit<PeriodEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    
    setPeriodEntries(prev => {
      // Check if there's already an entry for this date
      const existingEntryIndex = prev.findIndex(e => 
        isSameDay(new Date(e.date), new Date(entry.date))
      );
      
      if (existingEntryIndex >= 0) {
        // Replace the existing entry
        const updatedEntries = [...prev];
        updatedEntries[existingEntryIndex] = newEntry;
        return updatedEntries;
      } else {
        // Add new entry
        return [...prev, newEntry];
      }
    });

    // Update last period start if this is a new entry with flow that's not 'none'
    if (entry.flow !== 'none') {
      const entryDate = new Date(entry.date);
      // Check if this might be the start of a period
      const isStartDay = !periodEntries.some(e => {
        // Look for entries 1 day before this one with flow that's not 'none'
        const prevDay = subDays(entryDate, 1);
        return isSameDay(new Date(e.date), prevDay) && e.flow !== 'none';
      });

      if (isStartDay) {
        updateCycleData({ lastPeriodStart: entryDate });
        predictNextPeriod();
      }
    }

    toast({
      title: "Period data saved",
      description: `Entry for ${format(new Date(entry.date), 'MMMM d, yyyy')} has been saved.`,
    });
  };

  const updatePeriodEntry = (updatedEntry: PeriodEntry) => {
    setPeriodEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    
    toast({
      title: "Period data updated",
      description: `Entry for ${format(new Date(updatedEntry.date), 'MMMM d, yyyy')} has been updated.`,
    });

    // Recalculate predictions if needed
    if (updatedEntry.flow !== 'none') {
      predictNextPeriod();
    }
  };

  const deletePeriodEntry = (id: string) => {
    const entryToDelete = periodEntries.find(e => e.id === id);
    setPeriodEntries(prev => prev.filter(entry => entry.id !== id));
    
    if (entryToDelete) {
      toast({
        title: "Period data deleted",
        description: `Entry for ${format(new Date(entryToDelete.date), 'MMMM d, yyyy')} has been removed.`,
      });
    }

    // Recalculate predictions
    predictNextPeriod();
  };

  const getEntryForDate = (date: Date) => {
    return periodEntries.find(entry => isSameDay(new Date(entry.date), date));
  };

  const updateCycleData = (data: Partial<CycleData>) => {
    setCycleData(prev => ({ ...prev, ...data }));
  };

  const calculateStats = (): PeriodStats => {
    // Sort entries by date
    const sortedEntries = [...periodEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Find period start dates (days with non-none flow that don't have a previous day with flow)
    const periodStartDates: Date[] = [];
    sortedEntries.forEach((entry, index) => {
      if (entry.flow !== 'none') {
        const entryDate = new Date(entry.date);
        const prevDay = subDays(entryDate, 1);
        const hasPrevDayFlow = sortedEntries.some(e => 
          isSameDay(new Date(e.date), prevDay) && e.flow !== 'none'
        );
        
        if (!hasPrevDayFlow) {
          periodStartDates.push(entryDate);
        }
      }
    });

    // Calculate average cycle length
    let totalCycleLength = 0;
    let cycleCount = 0;
    
    for (let i = 0; i < periodStartDates.length - 1; i++) {
      const cycleLength = differenceInDays(periodStartDates[i + 1], periodStartDates[i]);
      if (cycleLength > 0 && cycleLength < 60) { // Ignore outliers
        totalCycleLength += cycleLength;
        cycleCount++;
      }
    }
    
    const averageCycleLength = cycleCount > 0 ? Math.round(totalCycleLength / cycleCount) : cycleData.cycleLength;

    // Calculate average period length
    let totalPeriodLength = 0;
    let periodCount = 0;
    
    for (let i = 0; i < periodStartDates.length; i++) {
      const startDate = periodStartDates[i];
      let periodLength = 1; // Start with 1 day

      // Count consecutive days with flow
      let currentDate = addDays(startDate, 1);
      while (
        sortedEntries.some(e => 
          isSameDay(new Date(e.date), currentDate) && e.flow !== 'none'
        )
      ) {
        periodLength++;
        currentDate = addDays(currentDate, 1);
      }

      if (periodLength > 0 && periodLength < 15) { // Ignore outliers
        totalPeriodLength += periodLength;
        periodCount++;
      }
    }
    
    const averagePeriodLength = periodCount > 0 ? Math.round(totalPeriodLength / periodCount) : cycleData.periodLength;

    // Calculate common symptoms
    const symptomCounts: Record<Symptom, number> = {
      cramps: 0,
      headache: 0,
      fatigue: 0,
      bloating: 0,
      backache: 0,
      nausea: 0,
      moodSwings: 0,
      breastTenderness: 0,
      spotting: 0,
    };
    
    periodEntries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomCounts[symptom]++;
      });
    });
    
    const sortedSymptoms = Object.entries(symptomCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([symptom]) => symptom as Symptom);

    return {
      averageCycleLength,
      averagePeriodLength,
      commonSymptoms: sortedSymptoms,
    };
  };

  const isPeriodDay = (date: Date): boolean => {
    // Check if the date has a period entry with flow that's not 'none'
    const entry = getEntryForDate(date);
    return !!entry && entry.flow !== 'none';
  };

  const predictNextPeriod = () => {
    // Need at least the last period start date
    if (!cycleData.lastPeriodStart) {
      return;
    }

    // Use the calculated stats or the user-set cycle length
    const stats = calculateStats();
    const cycleLength = stats.averageCycleLength || cycleData.cycleLength;
    
    // Predict the next period
    const nextPeriodPrediction = addDays(new Date(cycleData.lastPeriodStart), cycleLength);
    
    updateCycleData({ 
      nextPeriodPrediction,
      cycleLength,
      periodLength: stats.averagePeriodLength || cycleData.periodLength
    });
  };

  const togglePrivacy = () => {
    setIsPrivate(prev => !prev);
  };

  return (
    <PeriodContext.Provider
      value={{
        periodEntries,
        cycleData,
        addPeriodEntry,
        updatePeriodEntry,
        deletePeriodEntry,
        getEntryForDate,
        updateCycleData,
        calculateStats,
        isPeriodDay,
        predictNextPeriod,
        isPrivate,
        togglePrivacy,
      }}
    >
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
