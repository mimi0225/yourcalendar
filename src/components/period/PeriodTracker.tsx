
import React, { useState } from 'react';
import { usePeriod } from '@/context/PeriodContext';
import { format, addDays, isSameMonth, isSameDay, differenceInDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PeriodEntryForm from './PeriodEntryForm';
import { PeriodEntry } from '@/types/period';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Calendar as CalendarIcon, Droplet } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// This is the component for the calendar that highlights period days
const PeriodCalendar: React.FC = () => {
  const { 
    periodEntries, 
    getEntryForDate, 
    cycleData, 
    isPeriodDay 
  } = usePeriod();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  
  const selectedEntry = selectedDate ? getEntryForDate(selectedDate) : undefined;
  
  // Custom rendering of day cells to highlight period days
  const getDayClassNames = (date: Date, isSelected: boolean): string => {
    const isEntryDay = !!getEntryForDate(date);
    const isPeriod = isPeriodDay(date);
    
    let classes = '';
    
    if (isPeriod) {
      // Highlight based on flow intensity
      const entry = getEntryForDate(date);
      if (entry) {
        switch (entry.flow) {
          case 'light':
            classes += ' bg-[#FEC6A1] text-black';
            break;
          case 'medium':
            classes += ' bg-[#F97316] text-white';
            break;
          case 'heavy':
            classes += ' bg-[#9b87f5] text-white';
            break;
          default:
            classes += ' bg-[#E5DEFF] text-black';
        }
      }
    } else if (isEntryDay) {
      // Day has an entry but not period flow
      classes += ' bg-[#D3E4FD] text-black';
    }
    
    if (isSelected) {
      classes += ' ring-2 ring-offset-2 ring-primary';
    }
    
    // Special styling for predicted period
    if (cycleData.nextPeriodPrediction && cycleData.lastPeriodStart) {
      const predictedStart = new Date(cycleData.nextPeriodPrediction);
      const predictedEnd = addDays(predictedStart, cycleData.periodLength - 1);
      
      if (
        differenceInDays(date, predictedStart) >= 0 && 
        differenceInDays(predictedEnd, date) >= 0 &&
        !isPeriod
      ) {
        classes += ' border-2 border-[#FF9CA9] border-dashed';
      }
    }
    
    return classes;
  };
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4" key={refreshKey}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Period Calendar</h3>
        {selectedDate && (
          <PeriodEntryForm 
            date={selectedDate} 
            existingEntry={selectedEntry}
            onComplete={handleRefresh} 
          />
        )}
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="border rounded-md p-3 pointer-events-auto"
        modifiersClassNames={{
          selected: "custom-selected",
        }}
        modifiers={{
          custom: (date) => !!getEntryForDate(date),
        }}
        components={{
          DayContent: ({ date }) => {
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const className = getDayClassNames(date, isSelected);
            
            return (
              <div className={`h-9 w-9 p-0 font-normal flex items-center justify-center rounded-md ${className}`}>
                {date.getDate()}
              </div>
            );
          }
        }}
      />
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
          <span>Period Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#FF9CA9] border-dashed bg-transparent"></div>
          <span>Predicted</span>
        </div>
      </div>
    </div>
  );
};

// Component for showing selected entry details
interface EntryDetailsProps {
  entry: PeriodEntry;
  onRefresh: () => void;
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry, onRefresh }) => {
  const symptomLabels: Record<string, string> = {
    cramps: 'Cramps',
    headache: 'Headache',
    fatigue: 'Fatigue',
    bloating: 'Bloating',
    backache: 'Backache',
    nausea: 'Nausea',
    moodSwings: 'Mood Swings',
    breastTenderness: 'Breast Tenderness',
    spotting: 'Spotting',
  };
  
  const flowLabels: Record<string, string> = {
    none: 'None',
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
  };
  
  const flowColors: Record<string, string> = {
    none: 'bg-[#E5DEFF]',
    light: 'bg-[#FEC6A1]',
    medium: 'bg-[#F97316]',
    heavy: 'bg-[#9b87f5]',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{format(new Date(entry.date), 'MMMM d, yyyy')}</CardTitle>
          <PeriodEntryForm existingEntry={entry} onComplete={onRefresh} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Flow:</span>
          <div className="flex items-center mt-1">
            <div className={`w-3 h-3 rounded-full mr-2 ${flowColors[entry.flow]}`}></div>
            <span>{flowLabels[entry.flow]}</span>
          </div>
        </div>
        
        {entry.symptoms.length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Symptoms:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {entry.symptoms.map(symptom => (
                <Badge key={symptom} variant="outline">
                  {symptomLabels[symptom]}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {entry.notes && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Notes:</span>
            <p className="mt-1 text-sm">{entry.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main component
const PeriodTracker: React.FC = () => {
  const { 
    periodEntries, 
    cycleData, 
    isPrivate, 
    togglePrivacy,
    getEntryForDate,
    calculateStats,
  } = usePeriod();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  
  const stats = calculateStats();
  const selectedEntry = getEntryForDate(selectedDate);
  
  const daysUntilNextPeriod = cycleData.nextPeriodPrediction 
    ? Math.max(0, differenceInDays(new Date(cycleData.nextPeriodPrediction), new Date()))
    : null;
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isPrivate) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <Lock className="h-12 w-12 text-primary" />
        <h2 className="text-2xl font-semibold">Period Tracker is Private</h2>
        <p className="text-muted-foreground max-w-md">
          Your period tracker is currently private. Click below to view your personal period tracking information.
        </p>
        <Button onClick={togglePrivacy}>
          <Eye className="mr-2 h-4 w-4" />
          Show Period Tracker
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center">
          <Droplet className="mr-2 h-5 w-5 text-primary" />
          Period Tracker
        </h2>
        <Button variant="outline" size="sm" onClick={togglePrivacy}>
          <EyeOff className="mr-2 h-4 w-4" />
          Hide
        </Button>
      </div>
      
      <Tabs defaultValue="calendar">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="stats">
            <div className="flex items-center">
              <Droplet className="mr-2 h-4 w-4" />
              Insights
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PeriodCalendar />
            
            <div className="space-y-4">
              {cycleData.nextPeriodPrediction && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Next Period</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span className="text-lg font-medium">
                        {format(new Date(cycleData.nextPeriodPrediction), 'MMMM d')}
                      </span>
                      {daysUntilNextPeriod !== null && (
                        <Badge variant="outline" className="ml-2">
                          {daysUntilNextPeriod === 0 ? "Today" : `In ${daysUntilNextPeriod} days`}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Expected to last {cycleData.periodLength} days
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {selectedEntry && (
                <EntryDetails entry={selectedEntry} onRefresh={handleRefresh} />
              )}
              
              {!selectedEntry && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No period data for this date</p>
                  </CardContent>
                  <CardFooter>
                    <PeriodEntryForm date={selectedDate} onComplete={handleRefresh} />
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Cycle Length</p>
                  <p className="text-2xl font-semibold">{stats.averageCycleLength} days</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Period Length</p>
                  <p className="text-2xl font-semibold">{stats.averagePeriodLength} days</p>
                </div>
                
                {cycleData.lastPeriodStart && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Period Started</p>
                    <p className="text-xl font-medium">
                      {format(new Date(cycleData.lastPeriodStart), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Common Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.commonSymptoms.length > 0 ? (
                  <div className="space-y-2">
                    {stats.commonSymptoms.map((symptom, index) => {
                      const symptomLabel = {
                        cramps: 'Cramps',
                        headache: 'Headache',
                        fatigue: 'Fatigue',
                        bloating: 'Bloating',
                        backache: 'Backache',
                        nausea: 'Nausea',
                        moodSwings: 'Mood Swings',
                        breastTenderness: 'Breast Tenderness',
                        spotting: 'Spotting',
                      }[symptom];
                      
                      return (
                        <div key={symptom} className="flex items-center">
                          <div className="text-lg font-medium">{index + 1}.</div>
                          <div className="ml-2">{symptomLabel}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Not enough data to show common symptoms yet
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {periodEntries.length > 0 ? (
                  <div className="space-y-2">
                    {[...periodEntries]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map(entry => (
                        <div key={entry.id} className="flex justify-between items-center p-2 border rounded-md">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              entry.flow === 'light' ? 'bg-[#FEC6A1]' :
                              entry.flow === 'medium' ? 'bg-[#F97316]' :
                              entry.flow === 'heavy' ? 'bg-[#9b87f5]' : 'bg-[#E5DEFF]'
                            }`}></div>
                            <span>{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">Details</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">{format(new Date(entry.date), 'MMMM d, yyyy')}</h4>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                  <span className="text-muted-foreground">Flow:</span>
                                  <span className="capitalize">{entry.flow}</span>
                                  
                                  {entry.symptoms.length > 0 && (
                                    <>
                                      <span className="text-muted-foreground">Symptoms:</span>
                                      <div className="flex flex-wrap gap-1">
                                        {entry.symptoms.map(s => (
                                          <Badge key={s} variant="outline" className="text-xs">
                                            {s}
                                          </Badge>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                  
                                  {entry.notes && (
                                    <>
                                      <span className="text-muted-foreground">Notes:</span>
                                      <span>{entry.notes}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No period entries added yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeriodTracker;
