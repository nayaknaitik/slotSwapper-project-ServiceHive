'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load token and user on initial mount
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      setToken(stored);
      api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
      fetchUser(stored);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (jwt?: string) => {
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${jwt || token}` },
      });
      setUser(res.data);
    } catch (err: any) {
      console.warn('User fetch failed:', err.response?.status);
      if (err.response?.status === 401) {
        console.log('Session expired → Logging out');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    await fetchUser(res.data.token);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    await fetchUser(res.data.token);
  };

  const logout = () => {
    console.log('Clearing auth state...');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const refreshUser = async () => {
    if (!token) return;
    await fetchUser(token);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout, refreshUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
