import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type AuthUser = {
  id?: number | string;
  username: string;
  email?: string;
};

type LoginPayload = {
  username: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  user_type?: 'user' | 'artist';
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');
      
      if (isLoggedIn && username) {
        setUser({
          username,
          email: `${username}@example.com`,
          id: 1
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: LoginPayload): Promise<void> => {
    // Static authentication
    const STATIC_USERNAME = 'admin';
    const STATIC_PASSWORD = 'admin123';

    if (data.username === STATIC_USERNAME && data.password === STATIC_PASSWORD) {
      const newUser = {
        username: data.username,
        email: `${data.username}@example.com`,
        id: 1
      };
      
      setUser(newUser);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.username);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (data: RegisterPayload): Promise<void> => {
    // Static registration - just accept any registration
    if (data.password !== data.password2) {
      throw new Error('Passwords do not match');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const newUser = {
      username: data.username,
      email: data.email,
      id: Date.now() // Use timestamp as ID
    };
    
    setUser(newUser);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', data.username);
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
