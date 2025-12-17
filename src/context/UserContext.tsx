import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  user: any;
  isPersonalizedView: boolean;
  isUrduView: boolean;
  userPreferences: any;
  togglePersonalization: () => void;
  toggleUrduView: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isPersonalizedView, setIsPersonalizedView] = useState(false);
  const [isUrduView, setIsUrduView] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});

  // Load user session from storage or API on component mount
  useEffect(() => {
    const loadUserSession = async () => {
      try {
        // Try to get user session from the backend
        const response = await fetch('http://localhost:4000/api/auth/session', {
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          const sessionData = await response.json();
          setUser(sessionData.user || null);
        } else {
          // No active session
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        setUser(null);
      }
    };

    loadUserSession();

    // Set up a listener for auth state changes
    const handleStorageChange = () => {
      loadUserSession();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const togglePersonalization = () => {
    setIsPersonalizedView(!isPersonalizedView);
  };

  const toggleUrduView = () => {
    setIsUrduView(!isUrduView);
  };

  const value = {
    user,
    isPersonalizedView,
    isUrduView,
    userPreferences,
    togglePersonalization,
    toggleUrduView,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};