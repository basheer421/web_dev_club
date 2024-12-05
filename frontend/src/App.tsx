import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import { AnimatePresence } from 'framer-motion';
import { theme } from './theme';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import EvaluationPage from './pages/EvaluationPage';
import ProjectSubmission from './pages/ProjectSubmission';
import Projects from './pages/Projects';
import PendingApproval from './pages/PendingApproval';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } />
            <Route path="/settings" element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            } />
            <Route path="/evaluation/:id" element={
              <AuthGuard>
                <EvaluationPage />
              </AuthGuard>
            } />
            <Route path="/submit-project" element={
              <AuthGuard>
                <ProjectSubmission />
              </AuthGuard>
            } />
            <Route path="/projects" element={
              <AuthGuard>
                <Projects />
              </AuthGuard>
            } />
            <Route path="/approval" element={<PendingApproval />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
