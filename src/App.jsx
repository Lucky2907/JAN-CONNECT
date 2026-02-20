import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import PublicDashboard from './pages/PublicDashboard';

import AdminDashboard from './pages/AdminDashboard';
import AdminMapView from './pages/AdminMapView';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminComplaints from './pages/AdminComplaints';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="submit" element={<SubmitComplaint />} />
              <Route path="my-complaints" element={<MyComplaints />} />
              <Route path="public-dashboard" element={<PublicDashboard />} />
              
              <Route path="admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="admin/map-view" element={<ProtectedRoute adminOnly><AdminMapView /></ProtectedRoute>} />
              <Route path="admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
              <Route path="admin/complaints" element={<ProtectedRoute adminOnly><AdminComplaints /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
