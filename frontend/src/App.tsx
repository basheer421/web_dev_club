import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import { AnimatePresence } from 'motion/react';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import EvaluationPage from './pages/EvaluationPage';
import ProjectSubmission from './pages/ProjectSubmission';
import Projects from './pages/Projects';
import PendingApproval from './pages/PendingApproval';
import Register from './pages/Register';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
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
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
