
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Student from './pages/Student';
import PeriodTracker from './pages/PeriodTracker';
import Sports from './pages/Sports';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { BlackboardProvider } from './context/BlackboardContext';
import { StudentProvider } from './context/StudentContext';
import { PeriodProvider } from './context/PeriodContext';
import { SportsProvider } from './context/SportsContext';
import './App.css';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <PeriodProvider>
          <SportsProvider>
            <BlackboardProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/student" element={<Student />} />
                  <Route path="/period" element={<PeriodTracker />} />
                  <Route path="/sports" element={<Sports />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <Toaster />
            </BlackboardProvider>
          </SportsProvider>
        </PeriodProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;
