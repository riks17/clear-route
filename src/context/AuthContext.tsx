import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple mock user storage (in production, this would be a backend)
const mockUsers: Map<string, { password: string; role: 'user' | 'admin' }> = new Map([
  ['admin@busbook.com', { password: 'admin123', role: 'admin' }],
  ['user@example.com', { password: 'user123', role: 'user' }],
]);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = useCallback(async (email: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const storedUser = mockUsers.get(email);
    
    // For demo: accept any credentials, but validate role for admin
    if (role === 'admin') {
      if (storedUser?.role !== 'admin' || storedUser?.password !== password) {
        return false;
      }
    } else {
      // For users, auto-create account if not exists (demo purposes)
      if (!mockUsers.has(email)) {
        mockUsers.set(email, { password, role: 'user' });
      } else if (mockUsers.get(email)?.password !== password) {
        return false;
      }
    }

    setAuthState({
      user: { id: email, email, role },
      isAuthenticated: true,
    });

    return true;
  }, []);

  const signup = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mockUsers.has(email)) {
      return false; // User already exists
    }

    mockUsers.set(email, { password, role: 'user' });
    
    setAuthState({
      user: { id: email, email, role: 'user' },
      isAuthenticated: true,
    });

    return true;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
