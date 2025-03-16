
export interface PeriodEntry {
  id: string;
  date: Date;
  flow: FlowLevel;
  symptoms: Symptom[];
  notes?: string;
}

export type FlowLevel = 'light' | 'medium' | 'heavy' | 'none';

export type Symptom = 
  | 'cramps'
  | 'headache'
  | 'fatigue'
  | 'bloating'
  | 'backache'
  | 'nausea'
  | 'moodSwings'
  | 'breastTenderness'
  | 'spotting';

export interface CycleData {
  cycleLength: number; // in days
  periodLength: number; // in days
  lastPeriodStart?: Date;
  nextPeriodPrediction?: Date;
}

export interface PeriodStats {
  averageCycleLength: number;
  averagePeriodLength: number;
  commonSymptoms: Symptom[];
}
