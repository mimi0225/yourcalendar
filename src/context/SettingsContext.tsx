
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TabSettings } from '@/types/calendar';

interface SettingsContextType {
  tabSettings: TabSettings;
  toggleTab: (tabName: keyof TabSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabSettings, setTabSettings] = useState<TabSettings>({
    student: true,
    period: true,
    sports: true,
    settings: true
  });

  // Load saved settings from localStorage when component mounts
  useEffect(() => {
    const savedSettings = localStorage.getItem('tabSettings');
    
    if (savedSettings) {
      try {
        setTabSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved tab settings', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tabSettings', JSON.stringify(tabSettings));
  }, [tabSettings]);

  const toggleTab = (tabName: keyof TabSettings) => {
    setTabSettings(prev => ({
      ...prev,
      [tabName]: !prev[tabName]
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        tabSettings,
        toggleTab
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
