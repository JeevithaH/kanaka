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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(() => {
    if (typeof document === 'undefined') return;
    const session = document.cookie.split('; ').find(row => row.startsWith('skyrellac_session='));
    if (session) {
      try {
        const userData = JSON.parse(decodeURIComponent(session.split('=')[1]));
        setUser(userData);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }
      refreshUser();
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to connect to the server.' };
    }
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' });
    } catch (e) {
      console.error('Logout error:', e);
    }

    // Comprehensive client-side cookie removal
    document.cookie = 'skyrellac_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax;';
    document.cookie = 'skyrellac_session=; max-age=0; path=/; SameSite=Lax;';
    document.cookie = 'skyrellac_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    document.cookie = 'skyrellac_session=; max-age=0; path=/;';

    setUser(null);

    // Hard redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
