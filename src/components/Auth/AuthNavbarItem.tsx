import React from 'react';
import { useAuth } from '../Auth/AuthProvider';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

const AuthNavbarItem = () => {
  const { isAuthenticated, userProfile, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    // Refresh the page to update UI after sign out
    window.location.reload();
  };

  // Don't show auth items on auth pages to avoid confusion
  if (location.pathname.includes('/auth/')) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <div className="navbar__item">
        <Link
          to="#"
          className="navbar__link"
          onClick={(e) => {
            e.preventDefault();
            handleSignOut();
          }}
        >
          👤 {userProfile?.name || 'Learner'} (Sign Out)
        </Link>
      </div>
    );
  } else {
    return (
      <div className="navbar__item">
        <Link to="/auth/signup" className="button button--primary button--sm">
          Get Started
        </Link>
        <Link
          to="/auth/signin"
          className="button button--secondary button--sm"
          style={{ marginLeft: '8px' }}
        >
          Sign In
        </Link>
      </div>
    );
  }
};

export default AuthNavbarItem;