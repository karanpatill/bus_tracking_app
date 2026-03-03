import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AttendanceDashboard from "./components/AttendanceDashboard";
import StudentLogs from './components/StudentLogs';
import SearchLocation from './components/SearchLocation';
import AlertsPage from './components/AlertsPage';
import AddBus from './components/AddBus';
import LiveStream from './components/LiveStream';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Dashboard Layout Pages (with Sidebar) */}
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/attendance" element={<AttendanceDashboard />} />
          <Route path="/buslocation" element={<SearchLocation />} />
          <Route path="/student-logs" element={<StudentLogs />} />
          <Route path="/addbus" element={<AddBus />} />
          <Route path="/live-streams" element={<LiveStream />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/api/alerts" element={<AlertsPage />} />

          {/* Auth Pages (no sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Fallback */}
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
