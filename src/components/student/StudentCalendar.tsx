
import { useStudent } from '@/context/StudentContext';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen } from 'lucide-react';

const StudentCalendar = () => {
  const { assignments, tests, getClassById } = useStudent();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get all events for the selected date
  const assignmentsForDate = assignments.filter(assignment => 
    isSameDay(new Date(assignment.dueDate), selectedDate)
  );
  
  const testsForDate = tests.filter(test => 
    isSameDay(new Date(test.date), selectedDate)
  );

  // Custom day render function to show dots for days with events
  const dayHasEvents = (day: Date) => {
    const hasAssignment = assignments.some(assignment => 
      isSameDay(new Date(assignment.dueDate), day)
    );
    const hasTest = tests.some(test => 
      isSameDay(new Date(test.date), day)
    );
    return hasAssignment || hasTest;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="border rounded-md pointer-events-auto"
            modifiersStyles={{
              today: {
                fontWeight: 'bold',
                borderWidth: '2px',
                borderColor: 'var(--primary)',
              }
            }}
            components={{
              DayContent: ({ date, activeModifiers }) => {
                const hasEvents = dayHasEvents(date);
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {date.getDate()}
                    {hasEvents && (
                      <div className="absolute bottom-1 w-4 h-1 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              {assignmentsForDate.length === 0 && testsForDate.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No assignments or tests scheduled for this day
                </p>
              ) : (
                <div className="space-y-4">
                  {assignmentsForDate.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-1">
                        <BookOpen className="h-4 w-4" /> Assignments Due
                      </h3>
                      <div className="space-y-2">
                        {assignmentsForDate.map(assignment => {
                          const className = getClassById(assignment.classId)?.name || 'Unknown Class';
                          const classColor = getClassById(assignment.classId)?.color || '#9b87f5';
                          
                          return (
                            <div 
                              key={assignment.id}
                              className="p-3 rounded-lg border"
                              style={{ 
                                borderLeftWidth: '4px',
                                borderLeftColor: classColor
                              }}
                            >
                              <div className="font-medium">{assignment.title}</div>
                              <div className="text-sm text-muted-foreground">{className}</div>
                              <Badge 
                                variant="outline" 
                                className="mt-1"
                                style={{ 
                                  backgroundColor: classColor,
                                  color: isLightColor(classColor) ? 'black' : 'white'
                                }}
                              >
                                {assignment.type}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {testsForDate.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Tests
                      </h3>
                      <div className="space-y-2">
                        {testsForDate.map(test => {
                          const className = getClassById(test.classId)?.name || 'Unknown Class';
                          const classColor = getClassById(test.classId)?.color || '#9b87f5';
                          
                          return (
                            <div 
                              key={test.id}
                              className="p-3 rounded-lg border"
                              style={{ 
                                borderLeftWidth: '4px',
                                borderLeftColor: classColor
                              }}
                            >
                              <div className="font-medium">{test.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {className} {test.time && `at ${test.time}`}
                              </div>
                              <Badge 
                                variant="outline" 
                                className="mt-1"
                                style={{ 
                                  backgroundColor: classColor,
                                  color: isLightColor(classColor) ? 'black' : 'white'
                                }}
                              >
                                {test.type}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine if a color is light
const isLightColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

export default StudentCalendar;
