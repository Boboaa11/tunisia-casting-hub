import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  firstName?: string;
  lastName?: string;
  talentType?: string;
  city?: string;
  specialSkills?: string[];
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  portfolioPhotos?: string[];
}

export interface ProfileCompletionItem {
  key: string;
  label: string;
  weight: number;
  complete: boolean;
}

export function getProfileCompletion(user: User | null): { percentage: number; items: ProfileCompletionItem[] } {
  if (!user) return { percentage: 0, items: [] };
  const items: ProfileCompletionItem[] = [
    { key: 'avatar', label: 'Photo de profil', weight: 20, complete: !!user.avatar },
    { key: 'talentType', label: 'Type de talent', weight: 15, complete: !!user.talentType },
    { key: 'city', label: 'Ville', weight: 10, complete: !!user.city },
    { key: 'bio', label: 'Biographie', weight: 20, complete: !!user.bio },
    { key: 'specialSkills', label: 'Compétences spéciales', weight: 15, complete: !!(user.specialSkills && user.specialSkills.length > 0) },
    { key: 'physical', label: 'Caractéristiques physiques', weight: 10, complete: !!(user.height && user.weight && user.eyeColor && user.hairColor) },
    { key: 'portfolio', label: 'Photos du portfolio', weight: 10, complete: !!(user.portfolioPhotos && user.portfolioPhotos.length > 0) },
  ];
  const percentage = items.reduce((sum, item) => sum + (item.complete ? item.weight : 0), 0);
  return { percentage, items };
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingComplete: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  setSubscription: (hasSubscription: boolean) => void;
  completeOnboarding: () => void;
  refreshUser: () => Promise<void>;
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

async function fetchUserProfile(supabaseUser: SupabaseUser): Promise<User> {
  const meta = supabaseUser.user_metadata || {};
  
  // Try to load talent profile
  const { data: profile } = await supabase
    .from('talent_profiles')
    .select('*')
    .eq('user_id', supabaseUser.id)
    .maybeSingle();

  // Check active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', supabaseUser.id)
    .eq('status', 'active')
    .maybeSingle();

  const firstName = profile?.first_name || meta.first_name || '';
  const lastName = profile?.last_name || meta.last_name || '';

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: [firstName, lastName].filter(Boolean).join(' ') || supabaseUser.email?.split('@')[0] || '',
    role: (meta.role as UserRole) || 'talent',
    hasSubscription: !!subscription,
    avatar: profile?.photo_url || undefined,
    bio: profile?.bio || undefined,
    firstName,
    lastName,
    talentType: profile?.talent_type || undefined,
    city: profile?.city || undefined,
    specialSkills: profile?.skills || undefined,
    height: profile?.height || undefined,
    weight: profile?.weight || undefined,
    eyeColor: profile?.eye_color || undefined,
    hairColor: profile?.hair_color || undefined,
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);

  // Derive onboarding status from profile data
  const checkOnboardingStatus = (profile: User) => {
    // If user has talent role and hasn't filled basic profile info, onboarding is incomplete
    if (profile.role === 'talent' && !profile.talentType && !profile.bio) {
      setOnboardingComplete(false);
    } else {
      setOnboardingComplete(true);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(async () => {
          const profile = await fetchUserProfile(newSession.user);
          setUser(profile);
          checkOnboardingStatus(profile);
          setIsLoading(false);
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        const profile = await fetchUserProfile(existingSession.user);
        setUser(profile);
        checkOnboardingStatus(profile);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === 'Email not confirmed') {
        return { error: 'Veuillez confirmer votre email avant de vous connecter.' };
      }
      return { error: 'Email ou mot de passe incorrect.' };
    }
    return {};
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'talent',
        },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'Un compte avec cet email existe déjà.' };
      }
      return { error: error.message };
    }
    setOnboardingComplete(false);
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setOnboardingComplete(true);
    setRedirectAfterAuth(null);
  };

  const setSubscription = (hasSubscription: boolean) => {
    if (user) {
      setUser({ ...user, hasSubscription });
    }
  };

  const completeOnboarding = () => {
    setOnboardingComplete(true);
  };

  const refreshUser = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      const profile = await fetchUserProfile(currentSession.user);
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user,
      isLoading,
      onboardingComplete,
      login,
      signup,
      logout,
      setSubscription,
      completeOnboarding,
      refreshUser,
      redirectAfterAuth,
      setRedirectAfterAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
