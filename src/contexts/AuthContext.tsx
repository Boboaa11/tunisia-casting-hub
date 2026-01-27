import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'talent' | 'producer' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hasSubscription: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  signup: (email: string, password: string, name: string, role: UserRole) => void;
  logout: () => void;
  setSubscription: (hasSubscription: boolean) => void;
  redirectAfterAuth: string | null;
  setRedirectAfterAuth: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);

  const login = (email: string, password: string, role: UserRole) => {
    // Mock login - in real app this would call an API
    setUser({
      id: '1',
      email,
      name: email.split('@')[0],
      role,
      hasSubscription: false // Default to no subscription
    });
  };

  const signup = (email: string, password: string, name: string, role: UserRole) => {
    // Mock signup - in real app this would call an API
    setUser({
      id: '1',
      email,
      name,
      role,
      hasSubscription: false
    });
  };

  const logout = () => {
    setUser(null);
    setRedirectAfterAuth(null);
  };

  const setSubscription = (hasSubscription: boolean) => {
    if (user) {
      setUser({ ...user, hasSubscription });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      setSubscription,
      redirectAfterAuth,
      setRedirectAfterAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
