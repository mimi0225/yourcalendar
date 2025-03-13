
import { useState } from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ViewType } from '@/types/calendar';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const CalendarHeader = () => {
  const { 
    currentMonth, 
    nextMonth, 
    prevMonth, 
    goToToday, 
    selectedView, 
    setSelectedView,
    activeTheme,
    themeOptions,
    setActiveTheme
  } = useCalendar();

  const viewOptions: { value: ViewType; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ];

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center p-4 mb-4 gap-3">
      <div className="flex items-center">
        <Calendar className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Colorful Calendar</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold min-w-28 text-center">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="ml-2"
        >
          Today
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <Select
          value={selectedView}
          onValueChange={(value) => setSelectedView(value as ViewType)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            {viewOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={activeTheme}
          onValueChange={setActiveTheme}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {themeOptions.map((theme) => (
              <SelectItem 
                key={theme.value} 
                value={theme.value}
                className="flex items-center"
              >
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: theme.bgColor }}
                  ></div>
                  {theme.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default CalendarHeader;
