import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '../DashboardLayout';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.is_approved && location.pathname !== '/approval') {
    return <Navigate to="/approval" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default AuthGuard; 