# Quickstart Guide: Auth, Personalization & Urdu Translation

## Overview

This quickstart guide provides the essential steps to set up the dual-architecture system with backend authentication server and Docusaurus frontend integration. The system provides user authentication with profile collection, content personalization, and Urdu translation capabilities while addressing Docusaurus SSG limitations.

## Prerequisites

### System Requirements
- **Node.js**: LTS version for both backend and frontend
- **npm/yarn/pnpm**: Package manager for dependency installation
- **Git**: Version control for the repository

### Software Requirements
- **Better Auth**: For authentication management
- **Hono or Express**: For lightweight backend server
- **Docusaurus**: Version 3.x for the book platform
- **React**: Version 18.x for component development

## Architecture Setup

### 1. Create Backend Directory
```bash
mkdir backend
cd backend
npm init -y
```

### 2. Install Backend Dependencies
```bash
npm install better-auth hono
npm install -D nodemon
```

### 3. Set Up Environment Variables
Create a `.env` file in your backend directory:
```env
# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-key-here

# Database Configuration
DATABASE_URL=sqlite://auth.db
```

## Configuration Steps

### 1. Create Backend Server (backend/src/server.js)
```javascript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth/config.js';

const app = new Hono();

// Add CORS middleware to allow requests from Docusaurus frontend
app.use('/*', cors({
  origin: ['http://localhost:3000'], // Default Docusaurus port
  credentials: true,
}));

// Mount better-auth routes
app.route('/api/auth', auth);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const port = 4000;
console.log(`Server running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
```

### 2. Configure Better Auth with Extended Schema (backend/src/auth/config.js)
```javascript
import { betterAuth } from 'better-auth';
import { sqlite } from '@better-auth/sqlite';

export const auth = betterAuth({
  database: sqlite({
    url: 'auth.db',
    autoMigrate: true,
  }),
  // Extend user schema with required fields from specification
  user: {
    schema: {
      software_exp: {
        type: 'string',
        required: false,
      },
      hardware_rtx: {
        type: 'boolean',
        required: false,
      },
      hardware_robot: {
        type: 'boolean',
        required: false,
      },
      preferred_lang: {
        type: 'string',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});
```

### 3. Add Backend Scripts to package.json
```json
{
  "scripts": {
    "dev": "node src/server.js",
    "start": "node src/server.js"
  }
}
```

### 4. Install Frontend Dependencies in Main Directory
```bash
npm install better-auth/client react-query
```

## Frontend Implementation

### 1. Create User Context (src/context/UserContext.tsx)
```tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from 'better-auth/react';

interface UserContextType {
  user: any;
  isPersonalizedView: boolean;
  isUrduView: boolean;
  userPreferences: any;
  togglePersonalization: () => void;
  toggleUrduView: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { data: authData } = useAuth();
  const [isPersonalizedView, setIsPersonalizedView] = useState(false);
  const [isUrduView, setIsUrduView] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});

  const togglePersonalization = () => {
    setIsPersonalizedView(!isPersonalizedView);
  };

  const toggleUrduView = () => {
    setIsUrduView(!isUrduView);
  };

  const value = {
    user: authData?.user || null,
    isPersonalizedView,
    isUrduView,
    userPreferences,
    togglePersonalization,
    toggleUrduView,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
```

### 2. Create Authentication Modal (src/components/Auth/AuthModal.tsx)
```tsx
import React, { useState } from 'react';
import { useAuth } from 'better-auth/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1); // 1: auth, 2: profile wizard
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      try {
        // Sign up with basic credentials
        const result = await signUp({
          email,
          password,
          name,
        });

        if (result?.error) {
          console.error('Sign up error:', result.error);
          return;
        }

        // Move to profile wizard
        setStep(2);
      } catch (error) {
        console.error('Sign up error:', error);
      }
    } else {
      // Sign in
      try {
        await signIn({
          email,
          password,
        });
        onClose();
      } catch (error) {
        console.error('Sign in error:', error);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update user profile with background information
    onClose();
  };

  if (step === 2) {
    // Profile wizard form
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Software Experience</label>
              <select className="w-full p-2 border rounded">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">RTX GPU Access</label>
              <input type="checkbox" className="mr-2" />
              <span>Do you have access to an RTX-class GPU?</span>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Robot Access</label>
              <input type="checkbox" className="mr-2" />
              <span>Do you have access to a real robot?</span>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Complete
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded mb-4"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
```

### 3. Create PersonalizedBlock Component (src/components/Personalization/PersonalizedBlock.tsx)
```tsx
import React from 'react';
import { useUserContext } from '../../context/UserContext';

interface PersonalizedBlockProps {
  requirements: {
    rtx?: boolean;
    level?: 'beginner' | 'intermediate' | 'advanced';
  };
  children: React.ReactNode;
}

const PersonalizedBlock: React.FC<PersonalizedBlockProps> = ({
  requirements,
  children
}) => {
  const { user, isPersonalizedView } = useUserContext();

  // If personalization is not active, show content normally
  if (!isPersonalizedView) {
    return <>{children}</>;
  }

  // If no user or requirements not met, don't show content
  if (!user) {
    return null;
  }

  // Check if user profile meets requirements
  let meetsRequirements = true;

  if (requirements.rtx !== undefined) {
    meetsRequirements = meetsRequirements && user.hardware_rtx === requirements.rtx;
  }

  if (requirements.level) {
    meetsRequirements = meetsRequirements && user.software_exp === requirements.level;
  }

  return meetsRequirements ? <>{children}</> : null;
};

export default PersonalizedBlock;
```

### 4. Create Chapter Controls Bar (src/components/ChapterControls/ChapterControlsBar.tsx)
```tsx
import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import AuthModal from '../Auth/AuthModal';

const ChapterControlsBar: React.FC = () => {
  const {
    user,
    isPersonalizedView,
    isUrduView,
    togglePersonalization,
    toggleUrduView
  } = useUserContext();

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = user !== null;

  return (
    <div className="flex space-x-4 p-4 bg-gray-100 rounded-lg mb-6">
      <button
        onClick={isAuthenticated ? togglePersonalization : () => setShowAuthModal(true)}
        className={`px-4 py-2 rounded-full ${
          isPersonalizedView
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 border'
        }`}
      >
        {isPersonalizedView ? 'Personalized ✓' : 'Personalize Content'}
      </button>

      <button
        onClick={isAuthenticated ? toggleUrduView : () => setShowAuthModal(true)}
        className={`px-4 py-2 rounded-full ${
          isUrduView
            ? 'bg-green-500 text-white'
            : 'bg-white text-gray-700 border'
        }`}
      >
        {isUrduView ? 'اردو ✓' : 'Translate to Urdu'}
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default ChapterControlsBar;
```

### 5. Wrap App with Context (src/theme/Root.tsx)
```tsx
import React from 'react';
import { UserProvider } from '../context/UserContext';

export default function Root({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
```

## Running the Application

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Start Docusaurus Frontend
```bash
cd ..
npm start
```

## Quality Assurance Checklist

Before deploying, ensure:

- [ ] Backend server runs on port 4000
- [ ] CORS is properly configured for Docusaurus frontend
- [ ] Auth flows work correctly for signup and signin
- [ ] Profile data with extended schema is properly collected and stored
- [ ] Personalization adapts content based on user profile
- [ ] Urdu translation toggle works correctly
- [ ] All components work within Docusaurus environment
- [ ] No security vulnerabilities in token handling
- [ ] Performance is acceptable with new features
- [ ] Mobile responsiveness is maintained
- [ ] Accessibility standards are met

## Next Steps

1. Deploy your backend auth server separately from Docusaurus
2. Integrate ChapterControlsBar into all chapter pages
3. Create Urdu translations for key chapters
4. Implement personalization rules for different user profiles
5. Test end-to-end user flows
6. Document the dual-architecture for other developers