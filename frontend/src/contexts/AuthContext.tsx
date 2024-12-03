import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get<User>('/users/profile/');
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const mockUser: User = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    points: 10,
    level: 2,
    is_approved: true,
  };

  const login = async (credentials: { email: string; password: string }) => {
    // const response = await api.post<{ token: string; user: User }>('/users/login/', credentials);
    // localStorage.setItem('token', response.data.token);
    // setUser(response.data.user);
    console.log('Mock login');
    setUser(mockUser);
    localStorage.setItem('token', 'mockToken');
  };

  const logout = () => {
    console.log('Mock logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    // <AuthContext.Provider value={{ user, loading, login, logout }}>
    <AuthContext.Provider value={{ user: mockUser, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 