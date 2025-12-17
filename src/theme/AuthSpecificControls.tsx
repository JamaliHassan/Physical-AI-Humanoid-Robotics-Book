import React from 'react';
import { useUserContext } from '../context/UserContext';
import { useLocation } from '@docusaurus/router';
import PersonalizeButton from '../components/Personalization/PersonalizeButton';
import TranslateButton from '../components/Translation/TranslateButton';

// Component to show personalization and translation controls on content pages
const AuthSpecificControls: React.FC = () => {
  const { user, isPersonalizedView, isUrduView } = useUserContext();
  const location = useLocation();

  // Only show on content pages (docs), not on auth pages
  const isDocsPage = location.pathname.startsWith('/docs/') && !location.pathname.includes('/auth/');

  // Check if user is authenticated (user object exists)
  const isAuthenticated = !!user;
  const authLoading = false; // No loading state needed with better-auth context

  if (!isAuthenticated || !isDocsPage) {
    return null;
  }

  // Extract chapter ID from URL path
  const pathParts = location.pathname.split('/');
  const chapterId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

  return (
    <div className="container margin-bottom--lg">
      <div className="row">
        <div className="col col--6">
          <PersonalizeButton chapterId={chapterId} />
        </div>
        <div className="col col--6 text--right">
          <TranslateButton chapterId={chapterId} />
        </div>
      </div>
    </div>
  );
};

export default AuthSpecificControls;