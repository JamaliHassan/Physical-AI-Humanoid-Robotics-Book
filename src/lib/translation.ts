// Translation logic for the Physical AI & Humanoid Robotics book
import { UserPreferences } from '../auth/types';

// Urdu translations for common technical terms
const URDU_TRANSLATIONS: Record<string, string> = {
  // Robotics terms
  'robotics': 'روبوٹکس',
  'humanoid': 'ہیومنوڈ',
  'physical AI': 'فزکل AI',
  'simulation': 'سیمولیشن',
  'control': 'کنٹرول',
  'navigation': 'نیویگیشن',
  'locomotion': 'لُوکوموشن',
  'actuator': 'ایکچوایٹر',
  'sensor': 'سینسر',
  'gait': 'گیٹ',
  'kinematics': 'کنیمیٹکس',
  'dynamics': 'ڈائینامکس',
  'perception': 'ادراک',
  'planning': 'پلاننگ',
  'machine learning': 'مشین لرننگ',
  'deep learning': 'ڈیپ لرننگ',
  'neural network': 'نیورل نیٹ ورک',
  'reinforcement learning': 'ریفورسمنٹ لرننگ',

  // Programming terms
  'code': 'کوڈ',
  'function': 'فنکشن',
  'variable': 'وریئبل',
  'algorithm': 'الگورتھم',
  'framework': 'فریم ورک',
  'library': 'لائبریری',
  'API': 'API',
  'interface': 'انٹرفیس',
  'component': 'کمپوننٹ',
  'module': 'ماڈیول',

  // General terms
  'chapter': 'باب',
  'section': 'سیکشن',
  'exercise': 'ورک آؤٹ',
  'example': 'مثال',
  'concept': 'تصور',
  'theory': 'نظریہ',
  'practice': 'عمل',
  'implementation': 'نافذ کرنا',
  'application': 'اطلاق',
  'development': 'تعمیر',
  'programming': 'پروگرامنگ',
  'tutorial': 'سیکھنا',
  'learning': 'سیکھنا',
  'course': 'کورس',
  'book': 'کتاب',
  'content': 'مواد',
  'text': 'متن',
  'video': 'ویڈیو',
  'diagram': 'ڈائیاگرام',
  'image': 'تصویر',
  'audio': 'آڈیو',
};

/**
 * Translate English text to Urdu
 * @param text - English text to translate
 * @param useGlossary - Whether to use the predefined glossary
 * @returns Translated Urdu text
 */
export const translateToUrdu = (text: string, useGlossary: boolean = true): string => {
  if (!useGlossary) {
    // In a real implementation, this would call a translation API
    return text; // Placeholder
  }

  let translatedText = text;

  // Replace terms using the glossary
  for (const [englishTerm, urduTerm] of Object.entries(URDU_TRANSLATIONS)) {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${englishTerm}\\b`, 'gi');
    translatedText = translatedText.replace(regex, urduTerm);
  }

  return translatedText;
};

/**
 * Get pre-translated content based on chapter ID
 * @param chapterId - ID of the chapter
 * @param contentId - Specific content block ID
 * @returns Pre-translated Urdu content
 */
export const getPreTranslatedContent = (chapterId: string, contentId: string): string | null => {
  // In a real implementation, this would fetch from a content management system
  // For now, we'll return null to indicate no pre-translated content exists
  return null;
};

/**
 * Check if user prefers Urdu translation
 * @param preferences - User's preferences
 * @returns Boolean indicating if Urdu is preferred
 */
export const userPrefersUrdu = (preferences: UserPreferences): boolean => {
  return preferences.translationEnabled &&
         (preferences.defaultTranslation === 'Urdu' ||
         preferences.preferredLanguages?.includes('Urdu'));
};

/**
 * Process content for Urdu translation
 * @param content - Original English content
 * @param preferences - User's preferences
 * @param chapterId - ID of the chapter
 * @returns Processed content with Urdu translation
 */
export const processUrduContent = (
  content: string,
  preferences: UserPreferences,
  chapterId: string
): { english: string; urdu: string } => {
  const englishContent = content;
  let urduContent = content;

  if (preferences.translationEnabled) {
    // Try to get pre-translated content first
    const preTranslated = getPreTranslatedContent(chapterId, 'main');
    if (preTranslated) {
      urduContent = preTranslated;
    } else {
      // Fallback to glossary-based translation
      urduContent = translateToUrdu(content);
    }
  }

  return {
    english: englishContent,
    urdu: urduContent,
  };
};

/**
 * Generate bilingual content blocks
 * @param contentBlocks - Array of English content blocks
 * @param preferences - User's preferences
 * @param chapterId - ID of the chapter
 * @returns Array of bilingual content blocks
 */
export const generateBilingualContent = (
  contentBlocks: Array<{ id: string; content: string; type: string }>,
  preferences: UserPreferences,
  chapterId: string
): Array<{
  id: string;
  english: string;
  urdu: string;
  type: string;
}> => {
  return contentBlocks.map(block => {
    const processed = processUrduContent(block.content, preferences, chapterId);
    return {
      id: block.id,
      english: processed.english,
      urdu: processed.urdu,
      type: block.type,
    };
  });
};

/**
 * Get language direction for styling
 * @param language - Language code ('en' or 'ur')
 * @returns CSS direction property value
 */
export const getLanguageDirection = (language: 'en' | 'ur'): 'ltr' | 'rtl' => {
  return language === 'ur' ? 'rtl' : 'ltr';
};