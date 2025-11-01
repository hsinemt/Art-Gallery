import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthUser = {
  id?: number | string;
  username: string;
  email?: string;
};

type LoginPayload = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
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

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
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
