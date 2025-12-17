// Production-grade translation service for the Physical AI & Humanoid Robotics book
import React from 'react';
import { UserPreferences } from '../auth/types';

interface TranslationCache {
  [key: string]: {
    translatedText: string;
    timestamp: number;
    sourceLanguage: string;
    targetLanguage: string;
  };
}

interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
  confidence?: number;
}

class TranslationService {
  private static instance: TranslationService;
  private cache: TranslationCache = {};
  private cacheExpiryMs: number = 24 * 60 * 60 * 1000; // 24 hours
  private apiUrl: string;
  private apiKey: string | null;

  private constructor() {
    // In browser environment, we don't have access to process.env
    // So we'll use environment variables through window object or defaults
    this.apiUrl = typeof window !== 'undefined'
      ? (window as any).TRANSLATION_API_URL || 'https://api.example.com/translate'
      : 'https://api.example.com/translate';
    this.apiKey = typeof window !== 'undefined'
      ? (window as any).TRANSLATION_API_KEY || null
      : null;
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Translate text with caching and fallback mechanisms
  async translate(
    text: string,
    targetLanguage: string = 'ur',
    sourceLanguage: string = 'en',
    context?: string
  ): Promise<string> {
    // Create cache key
    const cacheKey = this.generateCacheKey(text, sourceLanguage, targetLanguage, context);

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Attempt to translate using external API
      const translation = await this.callTranslationAPI({
        text,
        sourceLanguage,
        targetLanguage,
        context
      });

      // Cache the result
      this.setInCache(cacheKey, translation.translatedText, sourceLanguage, targetLanguage);

      return translation.translatedText;
    } catch (error) {
      console.error('Translation API error:', error);

      // Fallback to glossary-based translation
      const fallbackTranslation = this.fallbackTranslate(text, targetLanguage);
      this.setInCache(cacheKey, fallbackTranslation, sourceLanguage, targetLanguage);
      return fallbackTranslation;
    }
  }

  // Translate multiple texts efficiently
  async translateBatch(
    texts: string[],
    targetLanguage: string = 'ur',
    sourceLanguage: string = 'en'
  ): Promise<string[]> {
    const results: string[] = [];

    for (const text of texts) {
      results.push(await this.translate(text, targetLanguage, sourceLanguage));
    }

    return results;
  }

  // Check if translation is needed based on user preferences
  shouldTranslate(preferences: UserPreferences, chapterId?: string): boolean {
    if (!preferences.translationEnabled) {
      return false;
    }

    // Check if user prefers Urdu
    const prefersUrdu = preferences.defaultTranslation === 'Urdu' ||
                       preferences.preferredLanguages?.includes('Urdu');

    if (!prefersUrdu) {
      return false;
    }

    // Additional logic could be added here based on chapter content
    return true;
  }

  // Get RTL/LTR direction for styling
  getLanguageDirection(languageCode: string): 'ltr' | 'rtl' {
    const rtlLanguages = ['ur', 'ar', 'he', 'fa', 'ps', 'sd', 'ug', 'ku', 'dv', 'ha'];
    return rtlLanguages.includes(languageCode.toLowerCase()) ? 'rtl' : 'ltr';
  }

  // Get language name for display
  getLanguageDisplayName(languageCode: string): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'ur': 'Urdu',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'hi': 'Hindi',
      'ar': 'Arabic',
    };

    return languageNames[languageCode.toLowerCase()] || languageCode.toUpperCase();
  }

  // Pre-translate content for better performance
  async pretranslateContent(
    contentId: string,
    content: string,
    targetLanguage: string = 'ur'
  ): Promise<void> {
    // In a real implementation, this would call an API to pre-translate content
    // and store it for later retrieval
    try {
      const translated = await this.translate(content, targetLanguage);

      // Store in cache with content ID as key
      const cacheKey = `content:${contentId}:${targetLanguage}`;
      this.setInCache(cacheKey, translated, 'en', targetLanguage);
    } catch (error) {
      console.error('Pre-translation error:', error);
    }
  }

  // Get pre-translated content if available
  getPretranslatedContent(contentId: string, targetLanguage: string = 'ur'): string | null {
    const cacheKey = `content:${contentId}:${targetLanguage}`;
    return this.getFromCache(cacheKey);
  }

  // Process content with translation
  async processContent(
    content: string,
    preferences: UserPreferences,
    chapterId?: string
  ): Promise<{ original: string; translated?: string }> {
    if (!this.shouldTranslate(preferences, chapterId)) {
      return { original: content };
    }

    const translated = await this.translate(content, 'ur', 'en', chapterId);
    return { original: content, translated };
  }

  // Process multiple content blocks
  async processContentBlocks(
    contentBlocks: Array<{ id: string; content: string; type: string }>,
    preferences: UserPreferences,
    chapterId?: string
  ): Promise<Array<{
    id: string;
    original: string;
    translated?: string;
    type: string;
  }>> {
    if (!this.shouldTranslate(preferences, chapterId)) {
      return contentBlocks.map(block => ({
        ...block,
        original: block.content
      }));
    }

    // Process in batches for efficiency
    const batch = contentBlocks.map(block => block.content);
    const translatedBatch = await this.translateBatch(batch, 'ur', 'en');

    return contentBlocks.map((block, index) => ({
      ...block,
      original: block.content,
      translated: translatedBatch[index]
    }));
  }

  // Internal method to call translation API
  private async callTranslationAPI(request: TranslationRequest): Promise<TranslationResponse> {
    if (!this.apiKey) {
      throw new Error('Translation API key not configured');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        q: request.text,
        source: request.sourceLanguage,
        target: request.targetLanguage,
        context: request.context || '',
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      translatedText: data.translatedText || data.translation || request.text,
      detectedSourceLanguage: data.detectedSourceLanguage,
      confidence: data.confidence,
    };
  }

  // Fallback translation using glossary
  private fallbackTranslate(text: string, targetLanguage: string): string {
    if (targetLanguage.toLowerCase() !== 'ur') {
      return text; // Only support Urdu fallback for now
    }

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

    let translatedText = text;

    // Replace terms using the glossary
    for (const [englishTerm, urduTerm] of Object.entries(URDU_TRANSLATIONS)) {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${this.escapeRegExp(englishTerm)}\\b`, 'gi');
      translatedText = translatedText.replace(regex, urduTerm);
    }

    return translatedText;
  }

  // Helper method to escape regex special characters
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Generate cache key
  private generateCacheKey(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    context?: string
  ): string {
    const baseKey = `${text}:${sourceLanguage}:${targetLanguage}`;
    return context ? `${baseKey}:${context}` : baseKey;
  }

  // Get from cache
  private getFromCache(key: string): string | null {
    const cached = this.cache[key];
    if (!cached) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.cacheExpiryMs) {
      delete this.cache[key];
      return null;
    }

    return cached.translatedText;
  }

  // Set in cache
  private setInCache(
    key: string,
    translatedText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): void {
    this.cache[key] = {
      translatedText,
      timestamp: Date.now(),
      sourceLanguage,
      targetLanguage,
    };
  }

  // Clear expired cache entries
  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of Object.entries(this.cache)) {
      if (now - value.timestamp > this.cacheExpiryMs) {
        delete this.cache[key];
      }
    }
  }

  // Clear all cache
  clearCache(): void {
    this.cache = {};
  }
}

// Singleton instance
export const translationService = TranslationService.getInstance();

// React hook for translation state
import { useState, useEffect, createContext, useContext } from 'react';

interface TranslationContextType {
  currentLanguage: string;
  direction: 'ltr' | 'rtl';
  isLoading: boolean;
  translate: (text: string, targetLanguage?: string) => Promise<string>;
  processContent: (content: string, chapterId?: string) => Promise<{ original: string; translated?: string }>;
  toggleLanguage: (language: string) => void;
  shouldTranslate: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set initial language based on user preferences or browser settings
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      setDirection(translationService.getLanguageDirection(savedLanguage));
    } else {
      // Default to English
      setDirection('ltr');
    }
  }, []);

  useEffect(() => {
    // Update direction when language changes
    setDirection(translationService.getLanguageDirection(currentLanguage));
  }, [currentLanguage]);

  const translate = async (text: string, targetLanguage?: string) => {
    if (!targetLanguage) targetLanguage = currentLanguage;
    if (targetLanguage === 'en') return text; // No translation needed

    setIsLoading(true);
    try {
      return await translationService.translate(text, targetLanguage, 'en');
    } finally {
      setIsLoading(false);
    }
  };

  const processContent = async (content: string, chapterId?: string) => {
    if (currentLanguage === 'en') {
      return { original: content };
    }

    setIsLoading(true);
    try {
      // For all users (authenticated or not), check if translation is needed
      return currentLanguage !== 'en'
        ? { original: content, translated: await translate(content, currentLanguage) }
        : { original: content };
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const shouldTranslate = currentLanguage !== 'en';

  const value = {
    currentLanguage,
    direction,
    isLoading,
    translate,
    processContent,
    toggleLanguage,
    shouldTranslate,
  };

  return React.createElement(TranslationContext.Provider, { value }, children);
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};