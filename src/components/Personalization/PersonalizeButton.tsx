import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';

interface PersonalizeButtonProps {
  chapterId: string;
}

const PersonalizeButton: React.FC<PersonalizeButtonProps> = ({ chapterId }) => {
  const { isAuthenticated, userProfile, isLoading } = useAuth();
  const [isPersonalized, setIsPersonalized] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-prompt">
        <p>Log in to personalize this chapter</p>
      </div>
    );
  }

  const togglePersonalization = () => {
    setIsPersonalized(!isPersonalized);
    // Apply personalization logic based on user profile
    // This would trigger content adaptation based on user profile
  };

  return (
    <button
      onClick={togglePersonalization}
      className={`personalize-button ${isPersonalized ? 'active' : ''}`}
      aria-label={isPersonalized ? 'Disable personalization' : 'Enable personalization'}
    >
      {isPersonalized ? 'Disable Personalization' : 'Personalize this chapter'}
    </button>
  );
};

export default PersonalizeButton;