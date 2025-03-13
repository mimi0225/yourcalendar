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
import { ChevronLeft, ChevronRight, Calendar, Palette } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
    setActiveTheme,
    activeCalendarTheme,
    calendarThemeOptions,
    setActiveCalendarTheme
  } = useCalendar();

  const [themePopoverOpen, setThemePopoverOpen] = useState(false);

  const viewOptions: { value: ViewType; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ];

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center p-4 mb-4 gap-3">
      <div className="flex items-center">
        <Calendar className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Your Calendar</h1>
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
        
        <Popover open={themePopoverOpen} onOpenChange={setThemePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">App Theme</h4>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.value}
                      className={`p-2 rounded-md border ${activeTheme === theme.value ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setActiveTheme(theme.value)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: theme.bgColor }}
                        ></div>
                        <span className="text-xs">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Calendar Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                  {calendarThemeOptions.map((theme) => (
                    <button
                      key={theme.value}
                      className={`p-2 rounded-md border ${activeCalendarTheme === theme.value ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setActiveCalendarTheme(theme.value)}
                    >
                      <span className="text-sm">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default CalendarHeader;
