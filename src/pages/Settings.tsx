
import React from 'react';
import { useCalendar } from '@/context/CalendarContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Droplet, Trophy, Settings2, Clipboard, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { 
    activeTheme, 
    setActiveTheme, 
    activeCalendarTheme, 
    setActiveCalendarTheme,
    themeOptions,
    calendarThemeOptions 
  } = useCalendar();
  
  const { tabSettings, toggleTab } = useSettings();

  return (
    <div className="container max-w-7xl py-4 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button asChild variant="outline">
          <Link to="/">Back to Calendar</Link>
        </Button>
      </div>

      <Tabs defaultValue="tabs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tabs">Tab Visibility</TabsTrigger>
          <TabsTrigger value="themes">Theme Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tabs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tab Visibility</CardTitle>
              <CardDescription>
                Toggle which tabs appear in the navigation menu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <Label htmlFor="student-tab">Student Tab</Label>
                </div>
                <Switch
                  id="student-tab"
                  checked={tabSettings.student}
                  onCheckedChange={() => toggleTab('student')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplet className="h-5 w-5" />
                  <Label htmlFor="period-tab">Period Tab</Label>
                </div>
                <Switch
                  id="period-tab"
                  checked={tabSettings.period}
                  onCheckedChange={() => toggleTab('period')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <Label htmlFor="sports-tab">Sports Tab</Label>
                </div>
                <Switch
                  id="sports-tab"
                  checked={tabSettings.sports}
                  onCheckedChange={() => toggleTab('sports')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clipboard className="h-5 w-5" />
                  <Label htmlFor="chores-tab">Chores Tab</Label>
                </div>
                <Switch
                  id="chores-tab"
                  checked={tabSettings.chores}
                  onCheckedChange={() => toggleTab('chores')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <Label htmlFor="budget-tab">Budget Tab</Label>
                </div>
                <Switch
                  id="budget-tab"
                  checked={tabSettings.budget}
                  onCheckedChange={() => toggleTab('budget')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings2 className="h-5 w-5" />
                  <Label htmlFor="settings-tab">Settings Tab</Label>
                </div>
                <Switch
                  id="settings-tab"
                  checked={tabSettings.settings}
                  onCheckedChange={() => toggleTab('settings')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Customization</CardTitle>
              <CardDescription>
                Customize the appearance of your calendar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Accent Theme</Label>
                <Select
                  value={activeTheme}
                  onValueChange={setActiveTheme}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((theme) => (
                      <SelectItem 
                        key={theme.value} 
                        value={theme.value}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: theme.bgColor }}
                          />
                          {theme.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calendar-theme">Calendar Theme</Label>
                <Select
                  value={activeCalendarTheme}
                  onValueChange={setActiveCalendarTheme}
                >
                  <SelectTrigger id="calendar-theme">
                    <SelectValue placeholder="Select a calendar theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendarThemeOptions.map((theme) => (
                      <SelectItem 
                        key={theme.value} 
                        value={theme.value}
                      >
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-sm text-muted-foreground">
                  Your theme preferences are automatically saved and will be applied across all your devices.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
