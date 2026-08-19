'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = document.cookie.split('; ').find(row => row.startsWith('skyrellac_session='));
    if (session) {
      try {
        const userData = JSON.parse(decodeURIComponent(session.split('=')[1]));
        setUser(userData);
      } catch { /* invalid cookie */ }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    const isAdmin = email.includes('admin');
    const userData: User = {
      id: isAdmin ? 'admin-1' : 'student-1',
      email,
      name: isAdmin ? 'Admin User' : 'Alex Johnson',
      role: isAdmin ? 'admin' : 'student',
    };
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `skyrellac_session=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires}; path=/; SameSite=Lax`;
    setUser(userData);
    return true;
  }, []);

  const logout = useCallback(() => {
    document.cookie = 'skyrellac_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
