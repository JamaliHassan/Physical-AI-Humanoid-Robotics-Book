// Personalization logic for the Physical AI & Humanoid Robotics book
import { UserProfile } from '../auth/types';

/**
 * Determine content level based on user profile
 * @param userProfile - User's profile with experience and hardware access
 * @param chapterTopic - Topic of the chapter to adapt
 * @returns The appropriate content level to show
 */
export const getPersonalizedContentLevel = (
  userProfile: UserProfile | null,
  chapterTopic: string
): 'beginner' | 'intermediate' | 'advanced' => {
  if (!userProfile) return 'beginner';

  // For certain topics, adjust content level based on experience
  if (chapterTopic.includes('advanced') || chapterTopic.includes('expert')) {
    if (userProfile.roboticsExperience === 'advanced' ||
        userProfile.softwareExperience === 'advanced') {
      return 'advanced';
    }
    return 'intermediate';
  }

  // Default logic based on user's experience
  if (userProfile.softwareExperience === 'advanced' ||
      userProfile.roboticsExperience === 'advanced') {
    return 'advanced';
  } else if (userProfile.softwareExperience === 'intermediate' ||
             userProfile.roboticsExperience === 'intermediate') {
    return 'intermediate';
  }

  return 'beginner';
};

/**
 * Get hardware-specific content based on user's access
 * @param userProfile - User's profile with hardware access information
 * @param chapterTopic - Topic of the chapter
 * @returns Array of hardware-specific content recommendations
 */
export const getHardwareSpecificContent = (
  userProfile: UserProfile | null,
  chapterTopic: string
): string[] => {
  if (!userProfile) return [];

  const recommendations: string[] = [];

  // Recommend RTX-specific content if user has RTX
  if (userProfile.hardwareAccess.hasRTX) {
    if (chapterTopic.includes('simulation') || chapterTopic.includes('training')) {
      recommendations.push('Show RTX-optimized examples');
    }
  }

  // Recommend Jetson-specific content if user has Jetson
  if (userProfile.hardwareAccess.hasJetson) {
    if (chapterTopic.includes('edge') || chapterTopic.includes('deployment')) {
      recommendations.push('Show Jetson deployment examples');
    }
  }

  // Recommend real robot content if user has real robot
  if (userProfile.hardwareAccess.hasRealRobot) {
    if (chapterTopic.includes('control') || chapterTopic.includes('navigation')) {
      recommendations.push('Show real robot examples');
    }
  }

  return recommendations;
};

/**
 * Filter content based on user's experience level
 * @param contentBlocks - Array of content blocks with difficulty levels
 * @param userProfile - User's profile with experience level
 * @returns Filtered content blocks appropriate for user
 */
export const filterContentByExperience = (
  contentBlocks: Array<{
    level: 'beginner' | 'intermediate' | 'advanced';
    content: string;
    type: 'text' | 'code' | 'diagram' | 'exercise';
  }>,
  userProfile: UserProfile | null
): Array<{
  level: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  type: 'text' | 'code' | 'diagram' | 'exercise';
}> => {
  if (!userProfile) return contentBlocks.filter(block => block.level === 'beginner');

  const userLevel = getPersonalizedContentLevel(userProfile, 'general');

  // Different filtering strategies based on user level
  switch (userLevel) {
    case 'advanced':
      // Show all content
      return contentBlocks;
    case 'intermediate':
      // Show intermediate and beginner content
      return contentBlocks.filter(block =>
        block.level === 'intermediate' || block.level === 'beginner'
      );
    case 'beginner':
      // Show only beginner content
      return contentBlocks.filter(block => block.level === 'beginner');
    default:
      return contentBlocks.filter(block => block.level === 'beginner');
  }
};

/**
 * Generate personalized learning path
 * @param userProfile - User's profile with experience and preferences
 * @param availableChapters - List of available chapters
 * @returns Personalized order of chapters
 */
export const generatePersonalizedLearningPath = (
  userProfile: UserProfile | null,
  availableChapters: Array<{
    id: string;
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    category: string;
  }>
): Array<{
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  category: string;
}> => {
  if (!userProfile) return availableChapters;

  // Sort chapters based on user profile
  return availableChapters.sort((a, b) => {
    // Prioritize content matching user's hardware access
    const aHardwareMatch = userProfile.hardwareAccess.hasRealRobot && a.category.includes('real') ? 1 : 0;
    const bHardwareMatch = userProfile.hardwareAccess.hasRealRobot && b.category.includes('real') ? 1 : 0;

    if (aHardwareMatch !== bHardwareMatch) {
      return bHardwareMatch - aHardwareMatch;
    }

    // Prioritize content matching user's experience level
    const aLevelMatch = getPersonalizedContentLevel(userProfile, a.category) === a.difficulty ? 1 : 0;
    const bLevelMatch = getPersonalizedContentLevel(userProfile, b.category) === b.difficulty ? 1 : 0;

    if (aLevelMatch !== bLevelMatch) {
      return bLevelMatch - aLevelMatch;
    }

    // Default order
    return 0;
  });
};