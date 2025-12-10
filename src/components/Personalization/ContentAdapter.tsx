import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../lib/auth';

interface ContentAdapterProps {
  chapterId: string;
  content: {
    beginner: React.ReactNode;
    intermediate: React.ReactNode;
    advanced: React.ReactNode;
  };
  hardwareSpecific?: {
    rtx?: React.ReactNode;
    jetson?: React.ReactNode;
    realRobot?: React.ReactNode;
  };
}

const ContentAdapter: React.FC<ContentAdapterProps> = ({
  chapterId,
  content,
  hardwareSpecific = {}
}) => {
  const userProfile = useUserProfile();
  const [adaptedContent, setAdaptedContent] = useState<React.ReactNode>(null);
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    if (!userProfile || !isPersonalized) {
      // Show default content when not personalized
      setAdaptedContent(content.beginner);
      return;
    }

    // Determine content based on user's experience level
    let selectedContent = content.beginner;

    if (userProfile.softwareExperience === 'advanced' ||
        userProfile.roboticsExperience === 'advanced') {
      selectedContent = content.advanced;
    } else if (userProfile.softwareExperience === 'intermediate' ||
               userProfile.roboticsExperience === 'intermediate') {
      selectedContent = content.intermediate;
    }

    // Add hardware-specific content if applicable
    if (userProfile.hardwareAccess.hasRTX && hardwareSpecific.rtx) {
      selectedContent = (
        <div>
          {selectedContent}
          {hardwareSpecific.rtx}
        </div>
      );
    }

    if (userProfile.hardwareAccess.hasJetson && hardwareSpecific.jetson) {
      selectedContent = (
        <div>
          {selectedContent}
          {hardwareSpecific.jetson}
        </div>
      );
    }

    if (userProfile.hardwareAccess.hasRealRobot && hardwareSpecific.realRobot) {
      selectedContent = (
        <div>
          {selectedContent}
          {hardwareSpecific.realRobot}
        </div>
      );
    }

    setAdaptedContent(selectedContent);
  }, [userProfile, isPersonalized, content, hardwareSpecific]);

  const togglePersonalization = () => {
    setIsPersonalized(!isPersonalized);
  };

  if (!userProfile) {
    return (
      <div className="content-adapter">
        <div className="auth-prompt">
          <p>Log in to see personalized content</p>
        </div>
        <div className="default-content">
          {content.beginner}
        </div>
      </div>
    );
  }

  return (
    <div className="content-adapter">
      <button
        onClick={togglePersonalization}
        className={`personalize-toggle ${isPersonalized ? 'active' : ''}`}
      >
        {isPersonalized ? 'Disable Personalization' : 'Enable Personalization'}
      </button>

      <div className="adapted-content">
        {adaptedContent}
      </div>
    </div>
  );
};

export default ContentAdapter;