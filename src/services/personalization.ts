// Production-grade personalization service for the Physical AI & Humanoid Robotics book
import React from 'react';

// Define UserProfile interface to match the expected structure
interface UserProfile {
  softwareExperience: string;
  roboticsExperience: string;
  hardwareAccess: {
    hasRTX: boolean;
    hasJetson: boolean;
    hasRealRobot: boolean;
  };
  preferredLanguages: string[];
}

interface PersonalizationPreferences {
  contentLevel: 'beginner' | 'intermediate' | 'advanced';
  showHardwareSpecificContent: boolean;
  preferredHardware: string[];
  learningPath: string[];
  contentFilters: string[];
}

interface ChapterPersonalization {
  chapterId: string;
  contentLevel: 'beginner' | 'intermediate' | 'advanced';
  hardwareSpecificContent: string[];
  difficultyAdjustment: number;
}

class PersonalizationService {
  private static instance: PersonalizationService;
  private userPreferences: PersonalizationPreferences | null = null;
  private chapterPersonalizations: Map<string, ChapterPersonalization> = new Map();

  private constructor() {}

  public static getInstance(): PersonalizationService {
    if (!PersonalizationService.instance) {
      PersonalizationService.instance = new PersonalizationService();
    }
    return PersonalizationService.instance;
  }

  // Initialize personalization based on user profile
  async initializePersonalization(userProfile: UserProfile | null): Promise<void> {
    if (!userProfile) {
      // Set default preferences for unauthenticated users
      this.userPreferences = {
        contentLevel: 'beginner',
        showHardwareSpecificContent: false,
        preferredHardware: [],
        learningPath: [],
        contentFilters: ['beginner-friendly'],
      };
      return;
    }

    // Determine preferences based on user profile
    const contentLevel = this.determineContentLevel(userProfile);
    const preferredHardware = this.extractPreferredHardware(userProfile);

    this.userPreferences = {
      contentLevel,
      showHardwareSpecificContent: this.shouldShowHardwareSpecificContent(userProfile),
      preferredHardware,
      learningPath: await this.generateLearningPath(userProfile),
      contentFilters: this.generateContentFilters(userProfile),
    };

    // Pre-compute chapter personalizations
    await this.precomputeChapterPersonalizations();
  }

  // Determine content level based on user profile
  private determineContentLevel(userProfile: UserProfile): 'beginner' | 'intermediate' | 'advanced' {
    // Prioritize robotics experience over software experience
    if (userProfile.roboticsExperience === 'advanced') return 'advanced';
    if (userProfile.softwareExperience === 'advanced') return 'advanced';

    if (userProfile.roboticsExperience === 'intermediate') return 'intermediate';
    if (userProfile.softwareExperience === 'intermediate') return 'intermediate';

    return 'beginner';
  }

  // Extract preferred hardware from user profile
  private extractPreferredHardware(userProfile: UserProfile): string[] {
    const hardware = [];
    if (userProfile.hardwareAccess.hasRTX) hardware.push('rtx');
    if (userProfile.hardwareAccess.hasJetson) hardware.push('jetson');
    if (userProfile.hardwareAccess.hasRealRobot) hardware.push('real-robot');
    return hardware;
  }

  // Determine if hardware-specific content should be shown
  private shouldShowHardwareSpecificContent(userProfile: UserProfile): boolean {
    return userProfile.hardwareAccess.hasRTX ||
           userProfile.hardwareAccess.hasJetson ||
           userProfile.hardwareAccess.hasRealRobot;
  }

  // Generate personalized learning path
  private async generateLearningPath(userProfile: UserProfile): Promise<string[]> {
    // This would typically call an API to get personalized learning path
    // For now, return a basic path based on experience level
    const basePath = [
      'introduction',
      'fundamentals',
      'intermediate-concepts',
      'advanced-topics'
    ];

    if (userProfile.softwareExperience === 'advanced' && userProfile.roboticsExperience === 'advanced') {
      return [
        'advanced-introduction',
        'optimization-techniques',
        'hardware-specific-implementations',
        'research-topics'
      ];
    } else if (userProfile.softwareExperience === 'intermediate' || userProfile.roboticsExperience === 'intermediate') {
      return [
        'intermediate-introduction',
        'practical-applications',
        'implementation-patterns',
        'advanced-concepts'
      ];
    }

    return basePath;
  }

  // Generate content filters based on user profile
  private generateContentFilters(userProfile: UserProfile): string[] {
    const filters = [this.determineContentLevel(userProfile)];

    if (userProfile.hardwareAccess.hasRTX) filters.push('rtx-optimized');
    if (userProfile.hardwareAccess.hasJetson) filters.push('jetson-deployment');
    if (userProfile.hardwareAccess.hasRealRobot) filters.push('real-robot-examples');

    return filters;
  }

  // Pre-compute personalization for all chapters
  private async precomputeChapterPersonalizations(): Promise<void> {
    // In a real implementation, this would fetch chapter data from an API
    // For now, we'll create some mock personalizations
    this.chapterPersonalizations.set('introduction', {
      chapterId: 'introduction',
      contentLevel: this.userPreferences?.contentLevel || 'beginner',
      hardwareSpecificContent: [],
      difficultyAdjustment: 0,
    });

    this.chapterPersonalizations.set('simulation', {
      chapterId: 'simulation',
      contentLevel: this.userPreferences?.contentLevel || 'beginner',
      hardwareSpecificContent: this.userPreferences?.preferredHardware || [],
      difficultyAdjustment: this.userPreferences?.preferredHardware.includes('rtx') ? 0.2 : 0,
    });

    this.chapterPersonalizations.set('deployment', {
      chapterId: 'deployment',
      contentLevel: this.userPreferences?.contentLevel || 'beginner',
      hardwareSpecificContent: this.userPreferences?.preferredHardware || [],
      difficultyAdjustment: this.userPreferences?.preferredHardware.includes('jetson') ? 0.3 : 0,
    });
  }

  // Get personalization for a specific chapter
  getChapterPersonalization(chapterId: string): ChapterPersonalization | null {
    return this.chapterPersonalizations.get(chapterId) || null;
  }

  // Get current user preferences
  getUserPreferences(): PersonalizationPreferences | null {
    return this.userPreferences;
  }

  // Update user preferences
  async updateUserPreferences(preferences: Partial<PersonalizationPreferences>): Promise<void> {
    if (!this.userPreferences) {
      throw new Error('Personalization not initialized');
    }

    this.userPreferences = {
      ...this.userPreferences,
      ...preferences,
    };

    // Re-compute chapter personalizations based on updated preferences
    await this.precomputeChapterPersonalizations();
  }

  // Filter content based on user preferences
  filterContent(contentBlocks: Array<{
    level: 'beginner' | 'intermediate' | 'advanced';
    content: string;
    type: string;
    hardwareSpecific?: string[];
  }>): Array<{
    level: 'beginner' | 'intermediate' | 'advanced';
    content: string;
    type: string;
    hardwareSpecific?: string[];
  }> {
    if (!this.userPreferences) {
      // Return only beginner content for unauthenticated users
      return contentBlocks.filter(block => block.level === 'beginner');
    }

    // Filter content based on user's content level
    const userLevel = this.userPreferences.contentLevel;
    let filteredBlocks = contentBlocks;

    switch (userLevel) {
      case 'advanced':
        // Show all content for advanced users
        break;
      case 'intermediate':
        // Show intermediate and beginner content
        filteredBlocks = contentBlocks.filter(
          block => block.level === 'intermediate' || block.level === 'beginner'
        );
        break;
      case 'beginner':
        // Show only beginner content
        filteredBlocks = contentBlocks.filter(
          block => block.level === 'beginner'
        );
        break;
    }

    // Filter hardware-specific content
    if (!this.userPreferences.showHardwareSpecificContent) {
      filteredBlocks = filteredBlocks.filter(
        block => !block.hardwareSpecific || block.hardwareSpecific.length === 0
      );
    } else {
      // Only show hardware-specific content that matches user's hardware
      filteredBlocks = filteredBlocks.filter(block => {
        if (!block.hardwareSpecific || block.hardwareSpecific.length === 0) {
          return true; // Show non-hardware-specific content
        }

        // Check if any of the hardware-specific tags match user's hardware
        return block.hardwareSpecific.some(hardware =>
          this.userPreferences?.preferredHardware.includes(hardware)
        );
      });
    }

    return filteredBlocks;
  }

  // Get personalized difficulty adjustment for content
  getDifficultyAdjustment(chapterId: string): number {
    const chapterPersonalization = this.getChapterPersonalization(chapterId);
    return chapterPersonalization?.difficultyAdjustment || 0;
  }
}

// React hook for personalization state
import { useState, useEffect, createContext, useContext } from 'react';

// Singleton instance
export const personalizationService = PersonalizationService.getInstance();

// Update the service to work with the new user schema
interface PersonalizationContextType {
  preferences: PersonalizationPreferences | null;
  chapterPersonalization: ChapterPersonalization | null;
  isLoading: boolean;
  updatePreferences: (preferences: Partial<PersonalizationPreferences>) => Promise<void>;
  getFilteredContent: (contentBlocks: any[]) => any[];
  getDifficultyAdjustment: (chapterId: string) => number;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

// We need to import UserContext to access the user data
// Since we can't import it directly here due to circular dependencies,
// we'll modify the approach to work without direct dependency on auth service

export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<PersonalizationPreferences | null>(null);
  const [chapterPersonalization, setChapterPersonalization] = useState<ChapterPersonalization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Since we can't import auth directly, we'll initialize with default preferences
  // The actual initialization will happen from components that have access to UserContext
  useEffect(() => {
    const initPersonalization = async () => {
      setIsLoading(true);
      try {
        // Initialize with default preferences for unauthenticated users
        await personalizationService.initializePersonalization(null);
        setPreferences(personalizationService.getUserPreferences());
      } catch (error) {
        console.error('Personalization initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initPersonalization();
  }, []);

  const updatePreferences = async (newPreferences: Partial<PersonalizationPreferences>) => {
    await personalizationService.updateUserPreferences(newPreferences);
    setPreferences(personalizationService.getUserPreferences());
  };

  const getFilteredContent = (contentBlocks: any[]) => {
    return personalizationService.filterContent(contentBlocks);
  };

  const getDifficultyAdjustment = (chapterId: string) => {
    return personalizationService.getDifficultyAdjustment(chapterId);
  };

  const value = {
    preferences,
    chapterPersonalization,
    isLoading,
    updatePreferences,
    getFilteredContent,
    getDifficultyAdjustment,
  };

  return React.createElement(PersonalizationContext.Provider, { value }, children);
};

export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};