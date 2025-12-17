import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';

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
  const { user, isUrduView, toggleUrduView } = useUserContext();
  const [currentContent, setCurrentContent] = useState<React.ReactNode>(englishContent);

  // Check if user is authenticated (user object exists)
  const isAuthenticated = !!user;
  const isLoading = false; // No loading state needed with better-auth context

  useEffect(() => {
    // Update content based on language selection from context
    setCurrentContent(isUrduView ? urduContent : englishContent);
  }, [isUrduView, englishContent, urduContent]);

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
        onClick={toggleUrduView}
        className={`language-toggle ${isUrduView ? 'urdu' : 'english'}`}
        aria-label={isUrduView ? 'Switch to English' : 'Switch to Urdu'}
      >
        {isUrduView ? 'انگریزی میں تبدیل کریں' : 'اردو میں تبدیل کریں'}
      </button>

      <div className={`content-container ${isUrduView ? 'urdu' : 'english'}`}>
        {currentContent}
      </div>
    </div>
  );
};

export default UrduContent;