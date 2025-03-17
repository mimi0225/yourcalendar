
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
