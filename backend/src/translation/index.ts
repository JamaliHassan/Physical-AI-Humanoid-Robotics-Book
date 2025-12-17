import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const translationApi = new Hono();

// Translation request schema
const TranslationRequestSchema = z.object({
  contentId: z.string(),
  sourceLang: z.string().optional().default('en'),
  targetLang: z.string().optional().default('ur'),
  content: z.string()
});

// Mock translation service (in a real implementation, this would connect to a translation API)
const mockTranslationService = {
  translate: async (content: string, targetLang: string = 'ur'): Promise<string> => {
    // In a real implementation, this would call an actual translation service
    // For now, we'll return the original content with a note that it's "translated"
    if (targetLang === 'ur') {
      // Return a mock Urdu translation
      return `[URDU TRANSLATION MOCK] ${content} [END MOCK TRANSLATION]`;
    }
    return content;
  }
};

// GET /api/translations/{contentId} - Get translated content
translationApi.get('/api/translations/:contentId', async (c) => {
  try {
    const { contentId } = c.req.param();
    const { sourceLang = 'en', targetLang = 'ur' } = c.req.query();

    // In a real implementation, this would fetch the content and translate it
    // For now, we'll return mock data
    const mockContent = `This is mock translated content for ${contentId}`;

    return c.json({
      contentId,
      sourceLang,
      targetLang,
      translatedContent: await mockTranslationService.translate(mockContent, targetLang),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Translation error:', error);
    return c.json({ error: 'Translation failed' }, 500);
  }
});

// POST /api/translations - Translate content
translationApi.post('/api/translations', zValidator('json', TranslationRequestSchema), async (c) => {
  try {
    const { contentId, sourceLang, targetLang, content } = await c.req.json();

    // Translate the content
    const translatedContent = await mockTranslationService.translate(content, targetLang);

    return c.json({
      contentId,
      sourceLang,
      targetLang,
      originalContent: content,
      translatedContent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Translation error:', error);
    return c.json({ error: 'Translation failed' }, 500);
  }
});

export default translationApi;