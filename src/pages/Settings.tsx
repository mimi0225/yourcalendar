
import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Droplet, Trophy, Settings2, Clipboard, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="tabs">Tab Visibility</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Settings;
