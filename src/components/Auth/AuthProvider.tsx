import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile } from '../../auth/types';

// Mock auth context for demonstration purposes
interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading auth state from storage
  useEffect(() => {
    const storedAuth = localStorage.getItem('mockAuth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(authData.isAuthenticated);
      if (authData.userProfile) {
        setUserProfile(authData.userProfile);
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);

    // Mock successful login with default profile
    const mockProfile: UserProfile = {
      softwareExperience: 'beginner',
      roboticsExperience: 'none',
      hardwareAccess: {
        hasRTX: false,
        hasJetson: false,
        hasRealRobot: false,
      },
      preferredLanguages: ['English'],
      signupCompleted: true,
    };

    setIsAuthenticated(true);
    setUserProfile(mockProfile);

    // Store in localStorage for persistence
    localStorage.setItem('mockAuth', JSON.stringify({
      isAuthenticated: true,
      userProfile: mockProfile
    }));

    setIsLoading(false);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem('mockAuth');
  };

  const signUp = async (userData: any) => {
    // Simulate API call
    setIsLoading(true);

    // Create profile from form data
    const newProfile: UserProfile = {
      softwareExperience: userData.softwareExperience || 'beginner',
      roboticsExperience: userData.roboticsExperience || 'none',
      hardwareAccess: {
        hasRTX: userData.hasRTX || false,
        hasJetson: userData.hasJetson || false,
        hasRealRobot: userData.hasRealRobot || false,
      },
      preferredLanguages: userData.preferredLanguages || ['English'],
      signupCompleted: true,
    };

    setIsAuthenticated(true);
    setUserProfile(newProfile);

    // Store in localStorage for persistence
    localStorage.setItem('mockAuth', JSON.stringify({
      isAuthenticated: true,
      userProfile: newProfile
    }));

    setIsLoading(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    userProfile,
    isLoading,
    signIn,
    signOut,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};