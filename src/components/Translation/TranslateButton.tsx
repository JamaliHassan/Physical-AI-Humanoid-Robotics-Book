// Production-grade translation button component
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../services/translation';
import { useUserContext } from '../../context/UserContext';

interface TranslateButtonProps {
  chapterId: string;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({ chapterId }) => {
  const {
    currentLanguage,
    direction,
    translate,
    toggleLanguage,
    shouldTranslate,
    isLoading: translationLoading
  } = useTranslation();

  const { user, toggleUrduView, isUrduView } = useUserContext();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if translation is available for this chapter
  const [isTranslationAvailable, setIsTranslationAvailable] = useState(true);

  useEffect(() => {
    // In a real implementation, this would check if translation is available
    // for the specific chapter content
    setIsTranslationAvailable(true);
    setIsInitialized(true);
  }, [chapterId]);

  // Check if user is authenticated (user object exists)
  const isAuthenticated = !!user;
  const authLoading = false; // No loading state needed with better-auth context

  if (!isInitialized) {
    return (
      <div className="translation-control loading">
        <div className="alert alert--secondary margin-bottom--md">
          <div className="text--center">
            <div className="loading-spinner"></div>
            <p>Loading translation options...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="translation-control not-authenticated">
        <div className="alert alert--info margin-bottom--md">
          <p>
            <strong>Access multilingual content:</strong>{' '}
            <a href="/auth/signup">Sign up</a> or{' '}
            <a href="/auth/signin">sign in</a> to translate this chapter into Urdu.
          </p>
        </div>
      </div>
    );
  }

  if (!isTranslationAvailable) {
    return (
      <div className="translation-control not-available">
        <div className="alert alert--warning margin-bottom--md">
          <p>
            <strong>Translation not available:</strong> Urdu translation for this chapter is coming soon.
          </p>
        </div>
      </div>
    );
  }

  const handleToggleTranslation = () => {
    if (translationLoading) return;

    // Toggle between English and Urdu using the context function
    toggleUrduView();
  };

  // Determine button state and text
  const isUrdu = isUrduView; // Use context state instead of translation service state
  const buttonLabel = isUrdu ? 'Switch to English' : 'Translate to Urdu';
  const buttonText = isUrdu ? '🌐 English Version' : '🇺🇦 Urdu Translation';
  const buttonIcon = isUrdu ? '🌐' : '🇺🇦';

  return (
    <div className="translation-control">
      <button
        onClick={handleToggleTranslation}
        disabled={translationLoading}
        className={`button ${
          isUrdu ? 'button--success' : 'button--primary'
        } button--outline button--sm`}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        {translationLoading ? (
          <>
            <span className="loading-spinner"></span> {isUrdu ? 'Switching to English...' : 'Translating...'}
          </>
        ) : (
          <>
            <span className="button-icon">{buttonIcon}</span>
            {buttonText}
          </>
        )}
      </button>

      {isUrdu && (
        <div className="alert alert--success margin-top--sm">
          <p className="text--small">
            <strong>Urdu translation active:</strong> Technical terms and code remain in English for accuracy.
          </p>
        </div>
      )}

      {direction === 'rtl' && isUrdu && (
        <div className="alert alert--info margin-top--sm">
          <p className="text--small">
            <strong>Right-to-left layout:</strong> Content is displayed in proper Urdu reading direction.
          </p>
        </div>
      )}
    </div>
  );
};

export default TranslateButton;