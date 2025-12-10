// Auth-related types for the Physical AI & Humanoid Robotics book

export interface UserProfile {
  softwareExperience: 'beginner' | 'intermediate' | 'advanced';
  roboticsExperience: 'none' | 'some' | 'advanced';
  hardwareAccess: HardwareAccess;
  preferredLanguages: string[]; // e.g., ['English', 'Urdu']
  signupCompleted: boolean;
}

export interface HardwareAccess {
  hasRTX: boolean;
  hasJetson: boolean;
  hasRealRobot: boolean;
  robotType?: 'quadruped' | 'humanoid' | 'other';
}

export interface UserPreferences {
  defaultPersonalization: boolean;
  defaultTranslation: 'English' | 'Urdu' | 'auto';
  lastChapter?: string;
  personalizationEnabled: boolean;
  translationEnabled: boolean;
}

export interface AuthState {
  userId: string;
  isLoggedIn: boolean;
  profile: UserProfile;
  sessionToken: string;
  expiresAt: Date;
}

export interface ChapterState {
  chapterId: string;
  personalizationEnabled: boolean;
  translationEnabled: boolean;
  currentLanguage: string;
  contentFilters: string[];
  viewMode: 'default' | 'personalized' | 'translated' | 'both';
}