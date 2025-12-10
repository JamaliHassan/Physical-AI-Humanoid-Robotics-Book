import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthProvider';

interface TranslateButtonProps {
  chapterId: string;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({ chapterId }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isUrdu, setIsUrdu] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-prompt">
        <p>Log in to translate this chapter</p>
      </div>
    );
  }

  const toggleTranslation = () => {
    setIsUrdu(!isUrdu);
    // Apply translation logic
    // This would switch content between English and Urdu
  };

  return (
    <button
      onClick={toggleTranslation}
      className={`translate-button ${isUrdu ? 'urdu' : 'english'}`}
      aria-label={isUrdu ? 'Switch to English' : 'Translate to Urdu'}
    >
      {isUrdu ? 'Back to English' : 'Translate to Urdu'}
    </button>
  );
};

export default TranslateButton;