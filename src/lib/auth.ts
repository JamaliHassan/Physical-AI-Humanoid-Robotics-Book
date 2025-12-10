// Auth utility functions for the Physical AI & Humanoid Robotics book
import { useAuth } from '../components/Auth/AuthProvider';
import { UserProfile, HardwareAccess, UserPreferences } from '../auth/types';

/**
 * Check if user is authenticated
 * @returns boolean indicating if user is logged in
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Get user profile from session
 * @returns UserProfile object or null if not authenticated
 */
export const useUserProfile = (): UserProfile | null => {
  const { userProfile } = useAuth();
  return userProfile || null;
};

/**
 * Check if user has specific hardware access
 * @param hardwareType - Type of hardware to check
 * @returns boolean indicating if user has the hardware
 */
export const hasHardwareAccess = (hardwareType: keyof HardwareAccess): boolean => {
  const profile = useUserProfile();
  if (!profile) return false;

  return profile.hardwareAccess[hardwareType] || false;
};

/**
 * Check if user has specific experience level
 * @param requiredLevel - Required experience level
 * @param experienceType - Type of experience to check
 * @returns boolean indicating if user meets the experience requirement
 */
export const hasExperienceLevel = (
  requiredLevel: 'beginner' | 'intermediate' | 'advanced',
  experienceType: 'software' | 'robotics'
): boolean => {
  const profile = useUserProfile();
  if (!profile) return false;

  const experience = experienceType === 'software'
    ? profile.softwareExperience
    : profile.roboticsExperience;

  // Define hierarchy for experience levels
  const levelHierarchy = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3
  };

  return levelHierarchy[experience] >= levelHierarchy[requiredLevel];
};

/**
 * Get user preferences
 * @returns UserPreferences object or default values
 */
export const useUserPreferences = (): UserPreferences => {
  // In a real implementation, this would fetch from a database or API
  // For now, returning default values
  return {
    defaultPersonalization: false,
    defaultTranslation: 'English',
    personalizationEnabled: false,
    translationEnabled: false
  };
};