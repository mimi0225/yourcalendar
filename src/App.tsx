
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Student from './pages/Student';
import PeriodTracker from './pages/PeriodTracker';
import Sports from './pages/Sports';
import Chores from './pages/Chores';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { BlackboardProvider } from './context/BlackboardContext';
import { StudentProvider } from './context/StudentContext';
import { PeriodProvider } from './context/PeriodContext';
import { SportsProvider } from './context/SportsContext';
import { SettingsProvider } from './context/SettingsContext';
import { CalendarProvider } from './context/CalendarContext';
import { ChoreProvider } from './context/ChoreContext';
import { BudgetProvider } from './context/BudgetContext';
import './App.css';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CalendarProvider>
          <StudentProvider>
            <PeriodProvider>
              <SportsProvider>
                <ChoreProvider>
                  <BudgetProvider>
                    <BlackboardProvider>
                      <Router>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/student" element={<Student />} />
                          <Route path="/period" element={<PeriodTracker />} />
                          <Route path="/sports" element={<Sports />} />
                          <Route path="/chores" element={<Chores />} />
                          <Route path="/budget" element={<Budget />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Router>
                      <Toaster />
                    </BlackboardProvider>
                  </BudgetProvider>
                </ChoreProvider>
              </SportsProvider>
            </PeriodProvider>
          </StudentProvider>
        </CalendarProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
