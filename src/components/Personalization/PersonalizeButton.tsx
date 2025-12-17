// Production-grade personalization button component
import React, { useState, useEffect } from 'react';
import { usePersonalization } from '../../services/personalization';
import { useUserContext } from '../../context/UserContext';

interface PersonalizeButtonProps {
  chapterId: string;
}

const PersonalizeButton: React.FC<PersonalizeButtonProps> = ({ chapterId }) => {
  const {
    preferences,
    updatePreferences,
    isLoading: personalizationLoading
  } = usePersonalization();

  const { user, togglePersonalization, isPersonalizedView } = useUserContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Check if user is authenticated (user object exists)
  const isAuthenticated = !!user;
  const authLoading = false; // No loading state needed with better-auth context

  if (!isInitialized) {
    return (
      <div className="personalization-control loading">
        <div className="alert alert--secondary margin-bottom--md">
          <div className="text--center">
            <div className="loading-spinner"></div>
            <p>Loading personalization settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="personalization-control not-authenticated">
        <div className="alert alert--info margin-bottom--md">
          <p>
            <strong>Enhance your learning experience:</strong>{' '}
            <a href="/auth/signup">Sign up</a> or{' '}
            <a href="/auth/signin">sign in</a> to personalize this chapter based on your experience level and hardware access.
          </p>
        </div>
      </div>
    );
  }

  const handleTogglePersonalization = async () => {
    if (personalizationLoading) return;

    try {
      // Toggle personalization using the context function
      togglePersonalization();
    } catch (error) {
      console.error('Error updating personalization:', error);
    }
  };

  // Determine if user has hardware access from the extended user schema
  const hasHardwareAccess = user?.hardware_rtx || user?.hardware_robot;

  // Get user's software experience level
  const softwareExperience = user?.software_exp;

  return (
    <div className="personalization-control">
      <button
        onClick={handleTogglePersonalization}
        disabled={personalizationLoading}
        className={`button ${
          isPersonalizedView ? 'button--success' : 'button--primary'
        } button--outline button--sm`}
        aria-label={isPersonalizedView ? 'Disable personalization' : 'Enable personalization'}
        title={isPersonalizedView ? 'Disable personalization' : 'Enable personalization'}
      >
        {personalizationLoading ? (
          <>
            <span className="loading-spinner"></span> {isPersonalizedView ? 'Disabling...' : 'Enabling...'}
          </>
        ) : (
          <>
            <span className="button-icon">🎯</span>
            {isPersonalizedView ? 'Personalization Active' : 'Personalize Content'}
          </>
        )}
      </button>

      {isPersonalizedView && (
        <div className="alert alert--success margin-top--sm">
          <p className="text--small">
            <strong>Personalized:</strong> Content adapted for your {softwareExperience} experience level
            {hasHardwareAccess && (
              <> and hardware environment</>
            )}.
          </p>
        </div>
      )}

      {softwareExperience === 'advanced' && (
        <div className="alert alert--info margin-top--sm">
          <p className="text--small">
            <strong>Advanced learner:</strong> You're seeing content with deeper technical details and advanced concepts.
          </p>
        </div>
      )}

      {hasHardwareAccess && (
        <div className="alert alert--info margin-top--sm">
          <p className="text--small">
            <strong>Hardware-specific content:</strong> Examples and exercises adapted for your hardware setup.
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalizeButton;