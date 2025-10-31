import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser, LoginPayload, RegisterPayload } from '../api/auth/auth';
import { getCurrentUser, loginUser, logoutUser, registerUser, getStoredToken } from '../api/auth/auth';
import axios from '../api/axios';

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setError: (msg: string | null) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // On mount, try to get current user (if token/cookie exists)
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshUser = async () => {
    const u = await getCurrentUser();
    setUser(u);
  };

  const login = async (data: LoginPayload) => {
    setError(null);
    const res = await loginUser(data);
    // Some backends return user in response, else fetch it
    const u = (res as any).user ?? (await getCurrentUser());
    setUser(u ?? null);
    // ensure axios instance uses the fresh token immediately
    const token = getStoredToken();
    if (token) {
      axios.defaults.headers = axios.defaults.headers || {};
      axios.defaults.headers['Authorization'] = `Token ${token}`;
    }
  };

  const register = async (data: RegisterPayload) => {
    setError(null);
    const res = await registerUser(data);
    const u = (res as any).user ?? (await getCurrentUser());
    setUser(u ?? null);
    const token = getStoredToken();
    if (token) {
      axios.defaults.headers = axios.defaults.headers || {};
      axios.defaults.headers['Authorization'] = `Token ${token}`;
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, login, register, logout, setError, refreshUser }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
