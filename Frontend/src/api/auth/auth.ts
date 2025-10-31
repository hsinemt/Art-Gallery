import axios from '../axios';
import type { AxiosInstance } from 'axios';

// Types
export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  user_type?: 'user' | 'artist';
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthUser = {
  id?: number | string;
  username: string;
  email: string;
};

export type AuthResponse = {
  token?: string;
  access?: string;
  refresh?: string;
  user?: AuthUser;
  [key: string]: any;
};

const TOKEN_KEY = 'auth_token';

// Use shared axios instance which already reads token from localStorage
const api = axios;


const setToken = (token?: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const extractToken = (data: AuthResponse): string | undefined => {

  return data.token || data.access;
};

export async function registerUser(data: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/users/register/', data);
  const token = extractToken(res.data);
  if (token) setToken(token);
  return res.data;
}

export async function loginUser(data: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/users/login/', data);
  const token = extractToken(res.data);
  if (token) setToken(token);
  return res.data;
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post('/api/users/logout/');
  } catch (_) {
    // ignore errors on logout to ensure client-side clears
  }
  setToken(null);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await api.get<AuthUser>('/api/users/profile/');

    const user = (res.data as any).user ? (res.data as any).user as AuthUser : (res.data as any as AuthUser);
    return user ?? null;
  } catch (e) {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
