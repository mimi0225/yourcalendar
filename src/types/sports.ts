
export type SportType = 'club' | 'school' | 'recreational' | 'professional' | 'other';

export interface SportTeam {
  id: string;
  name: string;
  type: SportType;
  color: string;
  location?: string;
  coach?: string;
  notes?: string;
}

export interface SportEvent {
  id: string;
  teamId: string;
  title: string;
  eventType: 'practice' | 'game' | 'tournament' | 'meeting' | 'other';
  date: Date;
  startTime: string;
  endTime?: string;
  location?: string;
  opponent?: string;
  notes?: string;
  completed: boolean;
}

export const sportTypeOptions = [
  { name: 'Club', value: 'club' },
  { name: 'School', value: 'school' },
  { name: 'Recreational', value: 'recreational' },
  { name: 'Professional', value: 'professional' },
  { name: 'Other', value: 'other' }
];

export const sportColorOptions = [
  { name: 'Red', value: '#FF6B6B' },
  { name: 'Blue', value: '#4D96FF' },
  { name: 'Green', value: '#6BCB77' },
  { name: 'Purple', value: '#9B5DE5' },
  { name: 'Orange', value: '#F9A826' },
  { name: 'Teal', value: '#2EC4B6' },
  { name: 'Pink', value: '#FF85A1' },
  { name: 'Yellow', value: '#F8D210' }
];
