import React, { createContext, useContext, useState, useEffect } from 'react';
import { getShared, setShared } from '../utils/sharedData';

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
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function getUsers(): Promise<(User & { password: string })[]> {
  const raw = await getShared('agesmart_users');
  return raw ? JSON.parse(raw) : [];
}

async function saveUsers(users: (User & { password: string })[]) {
  await setShared('agesmart_users', users);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('agesmart_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Poll for subscription changes from admin approval
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const users = await getUsers();
      const current = users.find((u) => u.id === user.id);
      if (current && current.subscription !== user.subscription) {
        const updated = { ...user, subscription: current.subscription };
        setUser(updated);
        localStorage.setItem('agesmart_user', JSON.stringify(updated));
      }
      if (current && current.verificationStatus !== user.verificationStatus) {
        const updated = { ...user, verificationStatus: current.verificationStatus, verified: current.verified };
        setUser(updated);
        localStorage.setItem('agesmart_user', JSON.stringify(updated));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('agesmart_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('agesmart_user');
    }
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    const users = await getUsers();
    const found = users.find((u) => u.email === email);
    if (found) {
      const { password: _, ...userData } = found;
      saveUser(userData);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = await getUsers();
    if (users.find((u) => u.email === email)) {
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
    await saveUsers(users);
    const { password: _, ...userData } = newUser;
    saveUser(userData);
    return true;
  };

  const logout = () => {
    saveUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      saveUser(updated);
      const users = await getUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        await saveUsers(users);
      }
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    const users = await getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1 || users[idx].password !== currentPassword) return false;
    users[idx].password = newPassword;
    await saveUsers(users);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
