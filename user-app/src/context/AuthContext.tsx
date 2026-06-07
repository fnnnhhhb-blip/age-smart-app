import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  subscription: 'free' | 'premium' | 'enterprise';
  dateOfBirth?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('agesmart_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('agesmart_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('agesmart_user');
    }
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('agesmart_users') || '[]');
    const found = users.find((u: User & { password: string }) => u.email === email);
    if (found) {
      const { password: _, ...userData } = found;
      saveUser(userData);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('agesmart_users') || '[]');
    if (users.find((u: { email: string }) => u.email === email)) {
      return false;
    }
    const newUser = {
      id: crypto.randomUUID(),
      email,
      name,
      password,
      verified: false,
      verificationStatus: 'none' as const,
      subscription: 'free' as const,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('agesmart_users', JSON.stringify(users));
    const { password: _, ...userData } = newUser;
    saveUser(userData);
    return true;
  };

  const logout = () => {
    saveUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      saveUser(updated);
      const users = JSON.parse(localStorage.getItem('agesmart_users') || '[]');
      const idx = users.findIndex((u: { id: string }) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem('agesmart_users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
