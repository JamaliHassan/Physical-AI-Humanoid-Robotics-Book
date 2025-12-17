// Production-grade content adapter for personalized content rendering
import React, { useState, useEffect, useMemo } from 'react';
import { usePersonalization } from '../../services/personalization';
import { useTranslation } from '../../services/translation';
import { useUserContext } from '../../context/UserContext';
import { personalizationService } from '../../services/personalization';

interface ContentBlock {
  id: string;
  type: 'text' | 'code' | 'diagram' | 'exercise' | 'example' | 'video';
  level: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  hardwareSpecific?: string[];
  prerequisites?: string[];
}

interface ContentAdapterProps {
  chapterId: string;
  contentBlocks?: ContentBlock[];
  // Backward compatibility for old API
  content?: {
    beginner: React.ReactNode;
    intermediate: React.ReactNode;
    advanced: React.ReactNode;
  };
  hardwareSpecific?: {
    rtx?: React.ReactNode;
    jetson?: React.ReactNode;
    realRobot?: React.ReactNode;
  };
  defaultContent?: string;
}

const ContentAdapter: React.FC<ContentAdapterProps> = ({
  chapterId,
  contentBlocks,
  content, // old API
  hardwareSpecific, // old API
  defaultContent
}) => {
  const {
    preferences,
    getFilteredContent,
    getDifficultyAdjustment,
    isLoading: personalizationLoading
  } = usePersonalization();

  const {
    processContent,
    currentLanguage,
    direction,
    isLoading: translationLoading
  } = useTranslation();

  const { user, isPersonalizedView } = useUserContext();

  const [processedBlocks, setProcessedBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert old API format to new format if needed
  const normalizedContentBlocks = useMemo(() => {
    if (contentBlocks) {
      // New API format
      return contentBlocks;
    } else if (content) {
      // Old API format - convert to new format
      const blocks: ContentBlock[] = [];

      if (content.beginner) {
        blocks.push({
          id: 'beginner',
          type: 'text',
          level: 'beginner',
          content: typeof content.beginner === 'string' ? content.beginner : JSON.stringify(content.beginner).substring(0, 100) + '...',
        });
      }

      if (content.intermediate) {
        blocks.push({
          id: 'intermediate',
          type: 'text',
          level: 'intermediate',
          content: typeof content.intermediate === 'string' ? content.intermediate : JSON.stringify(content.intermediate).substring(0, 100) + '...',
        });
      }

      if (content.advanced) {
        blocks.push({
          id: 'advanced',
          type: 'text',
          level: 'advanced',
          content: typeof content.advanced === 'string' ? content.advanced : JSON.stringify(content.advanced).substring(0, 100) + '...',
        });
      }

      // Add hardware-specific content if available
      if (hardwareSpecific) {
        if (hardwareSpecific.rtx) {
          blocks.push({
            id: 'rtx-specific',
            type: 'text',
            level: 'intermediate', // or 'advanced' based on context
            content: typeof hardwareSpecific.rtx === 'string' ? hardwareSpecific.rtx : 'RTX-specific content',
            hardwareSpecific: ['rtx']
          });
        }
        if (hardwareSpecific.jetson) {
          blocks.push({
            id: 'jetson-specific',
            type: 'text',
            level: 'intermediate',
            content: typeof hardwareSpecific.jetson === 'string' ? hardwareSpecific.jetson : 'Jetson-specific content',
            hardwareSpecific: ['jetson']
          });
        }
        if (hardwareSpecific.realRobot) {
          blocks.push({
            id: 'real-robot-specific',
            type: 'text',
            level: 'intermediate',
            content: typeof hardwareSpecific.realRobot === 'string' ? hardwareSpecific.realRobot : 'Real robot-specific content',
            hardwareSpecific: ['real-robot']
          });
        }
      }

      return blocks;
    } else {
      // Fallback to empty array
      return [];
    }
  }, [contentBlocks, content, hardwareSpecific]);

  // Check if user is authenticated (user object exists)
  const isAuthenticated = !!user;

  // Effect to initialize personalization service with user data when available
  useEffect(() => {
    const initializePersonalization = async () => {
      if (isAuthenticated && user) {
        // Create a UserProfile-like object from the better-auth user object
        const userProfile = {
          softwareExperience: user.software_exp || 'beginner',
          roboticsExperience: 'beginner', // default value
          hardwareAccess: {
            hasRTX: user.hardware_rtx || false,
            hasJetson: false, // default value
            hasRealRobot: user.hardware_robot || false,
          },
          preferredLanguages: [user.preferred_lang || 'en']
        };

        await personalizationService.initializePersonalization(userProfile);
      } else {
        // For unauthenticated users
        await personalizationService.initializePersonalization(null);
      }
    };

    initializePersonalization();
  }, [isAuthenticated, user]);

  // Filter content based on personalization preferences
  const filteredContentBlocks = useMemo(() => {
    if (!isAuthenticated || !isPersonalizedView) {
      // For unauthenticated users or when personalization is off, show all content
      return normalizedContentBlocks;
    }
    // For personalized view, apply filtering logic (this would need to be implemented in the service)
    return getFilteredContent(normalizedContentBlocks);
  }, [normalizedContentBlocks, isAuthenticated, isPersonalizedView, getFilteredContent]);

  // Determine difficulty adjustment for the chapter
  const difficultyAdjustment = useMemo(() => {
    if (!isAuthenticated || !isPersonalizedView) return 0;
    return getDifficultyAdjustment(chapterId);
  }, [chapterId, getDifficultyAdjustment, isAuthenticated, isPersonalizedView]);

  // Handle old API format (direct ReactNode rendering)
  if (content) {
    // Determine which content level to show based on user profile
    let selectedContent: React.ReactNode = content.beginner; // default to beginner

    if (isAuthenticated && user) {
      if (user.software_exp === 'advanced') {
        selectedContent = content.advanced || content.intermediate || content.beginner;
      } else if (user.software_exp === 'intermediate') {
        selectedContent = content.intermediate || content.beginner;
      } else {
        selectedContent = content.beginner;
      }
    }

    return (
      <div className="content-adapter">
        <div className="content-header">
          <div className="personalization-info">
            {isAuthenticated && isPersonalizedView && (
              <div className="user-profile-summary">
                <span className="experience-level">
                  Content adapted for {user?.software_exp} software experience
                </span>
                {user?.hardware_rtx && (
                  <span className="hardware-indicator">RTX-optimized</span>
                )}
                {user?.hardware_robot && (
                  <span className="hardware-indicator">Robot-ready</span>
                )}
                {currentLanguage !== 'en' && (
                  <span className="translation-indicator">
                    {currentLanguage === 'ur' ? 'اُردو ترجمہ' : 'Translated Content'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="content-display">
          {selectedContent}
        </div>

        {hardwareSpecific && (
          <div className="hardware-specific-content">
            {user?.hardware_rtx && hardwareSpecific.rtx}
            {user?.hardware_jetson && hardwareSpecific.jetson}
            {user?.hardware_robot && hardwareSpecific.realRobot}
          </div>
        )}

        {difficultyAdjustment > 0 && (
          <div className="difficulty-adjustment-notice">
            <div className="alert alert--info">
              <p>
                This content has been adjusted for your hardware setup to provide
                more relevant examples and implementation details.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle new API format (contentBlocks)
  // Process content for translation and personalization
  useEffect(() => {
    const processContentBlocks = async () => {
      setIsLoading(true);

      try {
        // Process each content block for translation
        const processed = await Promise.all(
          filteredContentBlocks.map(async (block) => {
            if (currentLanguage !== 'en') {
              const processed = await processContent(block.content, chapterId);
              return {
                ...block,
                originalContent: block.content,
                content: processed.translated || processed.original,
                isTranslated: !!processed.translated
              };
            }

            return {
              ...block,
              originalContent: block.content,
              isTranslated: false
            };
          })
        );

        setProcessedBlocks(processed);
      } catch (error) {
        console.error('Error processing content blocks:', error);
        // Fallback to original content
        setProcessedBlocks(
          filteredContentBlocks.map(block => ({
            ...block,
            originalContent: block.content,
            isTranslated: false
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!personalizationLoading && !translationLoading) {
      processContentBlocks();
    }
  }, [filteredContentBlocks, currentLanguage, processContent, chapterId, personalizationLoading, translationLoading]);

  // Render loading state
  if (isLoading || personalizationLoading || translationLoading) {
    return (
      <div className="content-adapter loading">
        <div className="loader-container">
          <div className="loading-spinner"></div>
          <p>Personalizing your learning experience...</p>
        </div>
      </div>
    );
  }

  // Render no content available message
  if (processedBlocks.length === 0) {
    return (
      <div className="content-adapter no-content">
        <div className="alert alert--warning">
          <h3>No content available</h3>
          <p>
            {isAuthenticated
              ? "There is no content matching your current preferences. Try adjusting your personalization settings."
              : "Please sign in to see personalized content based on your experience level and hardware access."}
          </p>
        </div>
      </div>
    );
  }

  // Render processed content blocks
  return (
    <div
      className={`content-adapter ${direction === 'rtl' ? 'rtl-layout' : 'ltr-layout'}`}
      dir={direction}
    >
      <div className="content-header">
        <div className="personalization-info">
          {isAuthenticated && isPersonalizedView && (
            <div className="user-profile-summary">
              <span className="experience-level">
                Content adapted for {user?.software_exp} software experience
              </span>
              {user?.hardware_rtx && (
                <span className="hardware-indicator">RTX-optimized</span>
              )}
              {user?.hardware_robot && (
                <span className="hardware-indicator">Robot-ready</span>
              )}
              {currentLanguage !== 'en' && (
                <span className="translation-indicator">
                  {currentLanguage === 'ur' ? 'اُردو ترجمہ' : 'Translated Content'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="content-blocks">
        {processedBlocks.map((block, index) => (
          <div
            key={block.id || index}
            className={`content-block block-type-${block.type} level-${block.level}`}
          >
            <div className="block-content">
              {block.type === 'code' ? (
                <pre className="code-block">
                  <code>{block.content}</code>
                </pre>
              ) : block.type === 'exercise' ? (
                <div className="exercise-block">
                  <h4>Practice Exercise</h4>
                  <div className="exercise-content" dangerouslySetInnerHTML={{ __html: block.content }} />
                </div>
              ) : block.type === 'diagram' ? (
                <div className="diagram-block">
                  <img src={block.content} alt="Concept diagram" />
                </div>
              ) : (
                <div
                  className="text-content"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}
            </div>

            {block.isTranslated && (
              <div className="translation-info">
                <small className="text--muted">
                  Translated from English
                </small>
              </div>
            )}
          </div>
        ))}
      </div>

      {difficultyAdjustment > 0 && (
        <div className="difficulty-adjustment-notice">
          <div className="alert alert--info">
            <p>
              This content has been adjusted for your hardware setup to provide
              more relevant examples and implementation details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAdapter;