
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Student from './pages/Student';
import PeriodTracker from './pages/PeriodTracker';
import Sports from './pages/Sports';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { BlackboardProvider } from './context/BlackboardContext';
import './App.css';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
