
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Student from './pages/Student';
import PeriodTracker from './pages/PeriodTracker';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student" element={<Student />} />
          <Route path="/period" element={<PeriodTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
