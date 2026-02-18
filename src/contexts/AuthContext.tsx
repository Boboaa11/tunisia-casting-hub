import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'talent' | 'producer' | 'admin' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hasSubscription: boolean;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

export interface DemoUser extends User {
  password: string;
  label: string;
  description: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-talent-sub',
    email: 'talent@demo.tn',
    password: 'demo',
    name: 'Amira Ben Salah',
    role: 'talent',
    hasSubscription: true,
    label: 'Talent (Abonnée)',
    description: 'Actrice professionnelle avec abonnement actif — accès complet aux candidatures.',
    avatar: '',
    bio: 'Actrice et mannequin basée à Tunis. 5 ans d\'expérience en cinéma et théâtre.',
    location: 'Tunis, Tunisie',
    phone: '+216 50 123 456',
  },
  {
    id: 'demo-talent-free',
    email: 'free@demo.tn',
    password: 'demo',
    name: 'Karim Hammami',
    role: 'talent',
    hasSubscription: false,
    label: 'Talent (Non abonné)',
    description: 'Acteur débutant sans abonnement — teste le paywall d\'application.',
    avatar: '',
    bio: 'Jeune acteur passionné, diplômé du conservatoire de Tunis.',
    location: 'Sousse, Tunisie',
    phone: '+216 55 987 654',
  },
  {
    id: 'demo-producer',
    email: 'producer@demo.tn',
    password: 'demo',
    name: 'Nadia Bouazizi',
    role: 'producer',
    hasSubscription: true,
    label: 'Productrice',
    description: 'Directrice de casting — gère les projets et consulte les candidatures.',
    avatar: '',
    bio: 'Directrice de casting chez Carthage Productions. 10 ans d\'expérience.',
    location: 'Tunis, Tunisie',
    phone: '+216 71 234 567',
  },
  {
    id: 'demo-admin',
    email: 'admin@demo.tn',
    password: 'demo',
    name: 'Slim Trabelsi',
    role: 'admin',
    hasSubscription: true,
    label: 'Administrateur',
    description: 'Accès administrateur — supervision complète de la plateforme.',
    avatar: '',
    bio: 'Administrateur de la plateforme Tunisia Casting.',
    location: 'Tunis, Tunisie',
    phone: '+216 71 000 000',
  },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  loginAsDemo: (demoUserId: string) => void;
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
    // Check if it's a demo user first
    const demoUser = DEMO_USERS.find(u => u.email === email);
    if (demoUser) {
      const { password: _, label: __, description: ___, ...userData } = demoUser;
      setUser(userData);
      return;
    }
    setUser({
      id: '1',
      email,
      name: email.split('@')[0],
      role,
      hasSubscription: false
    });
  };

  const loginAsDemo = (demoUserId: string) => {
    const demoUser = DEMO_USERS.find(u => u.id === demoUserId);
    if (demoUser) {
      const { password: _, label: __, description: ___, ...userData } = demoUser;
      setUser(userData);
    }
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
      loginAsDemo,
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
