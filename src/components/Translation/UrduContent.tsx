import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';

interface UrduContentProps {
  chapterId: string;
  englishContent: React.ReactNode;
  urduContent: React.ReactNode;
}

const UrduContent: React.FC<UrduContentProps> = ({
  chapterId,
  englishContent,
  urduContent
}) => {
  const { isAuthenticated, userProfile, isLoading } = useAuth();
  const [currentContent, setCurrentContent] = useState<React.ReactNode>(englishContent);
  const [isUrdu, setIsUrdu] = useState(false);

  useEffect(() => {
    // Check user's preferred language from profile
    if (userProfile && userProfile.preferredLanguages) {
      if (userProfile.preferredLanguages.includes('Urdu')) {
        setIsUrdu(true);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    // Update content based on language selection
    setCurrentContent(isUrdu ? urduContent : englishContent);
  }, [isUrdu, englishContent, urduContent]);

  const toggleLanguage = () => {
    setIsUrdu(!isUrdu);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="urdu-content">
        <div className="auth-prompt">
          <p>Log in to see content in your preferred language</p>
        </div>
        <div className="english-content">
          {englishContent}
        </div>
      </div>
    );
  }

  return (
    <div className="urdu-content">
      <button
        onClick={toggleLanguage}
        className={`language-toggle ${isUrdu ? 'urdu' : 'english'}`}
        aria-label={isUrdu ? 'Switch to English' : 'Switch to Urdu'}
      >
        {isUrdu ? 'انگریزی میں تبدیل کریں' : 'اردو میں تبدیل کریں'}
      </button>

      <div className={`content-container ${isUrdu ? 'urdu' : 'english'}`}>
        {currentContent}
      </div>
    </div>
  );
};

export default UrduContent;