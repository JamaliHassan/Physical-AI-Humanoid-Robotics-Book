# Quickstart Guide: Auth, Personalization, and Urdu Translation Features

## Overview

This quickstart guide provides the essential steps to set up and begin implementing the authentication, personalization, and Urdu translation features for the Physical AI & Humanoid Robotics book. Follow these steps to integrate Better Auth, personalization logic, and Urdu translation capabilities into your Docusaurus-based book.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.x or higher
- **npm/yarn/pnpm**: Package manager for dependency installation
- **Git**: Version control for the repository
- **Better Auth compatible database**: SQLite, PostgreSQL, MySQL, or MongoDB

### Software Requirements
- **Better Auth**: Latest version for authentication
- **Docusaurus**: Version 3.x for the book platform
- **React**: Version 18.x for component development
- **TypeScript**: Recommended for type safety (optional)

## Environment Setup

### 1. Install Better Auth
```bash
npm install better-auth
# or
yarn add better-auth
```

### 2. Install Docusaurus Dependencies
```bash
npm install @docusaurus/core@latest @docusaurus/preset-classic@latest
npm install @docusaurus/module-type-aliases @docusaurus/types
```

### 3. Set Up Environment Variables
Create a `.env` file in your project root:
```env
# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-key-here

# Database Configuration (choose one)
DATABASE_URL=sqlite://db.sqlite
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/database_name

# Optional: Translation API (if using on-demand translation)
TRANSLATION_API_KEY=your-translation-api-key
```

## Configuration Steps

### 1. Configure Better Auth
Create `src/auth/better-auth.config.ts`:
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // Configure your database connection
    provider: "sqlite", // or "postgresql", "mysql", "mongodb"
    url: process.env.DATABASE_URL!,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  // Extend user model for profile information
  user: {
    additionalFields: {
      softwareExperience: {
        type: "string",
        required: false,
      },
      roboticsExperience: {
        type: "string",
        required: false,
      },
      hasRTX: {
        type: "boolean",
        required: false,
      },
      hasJetson: {
        type: "boolean",
        required: false,
      },
      hasRealRobot: {
        type: "boolean",
        required: false,
      },
      preferredLanguages: {
        type: "string",
        required: false,
      },
    },
  },
});
```

### 2. Initialize Auth in Docusaurus
Update your `docusaurus.config.js` to include auth middleware:
```javascript
// In your docusaurus.config.js
module.exports = {
  // ... other config
  plugins: [
    // ... other plugins
    [
      '@docusaurus/plugin-content-pages',
      {
        path: 'src/pages',
        routeBasePath: '/',
      },
    ],
  ],
  // ... rest of config
};
```

### 3. Create Auth Components
Create a signup form component with background questions:

```tsx
// src/components/Auth/SignupForm.tsx
import React, { useState } from 'react';
import { useRegister } from 'better-auth/react';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    softwareExperience: 'beginner',
    roboticsExperience: 'none',
    hasRTX: false,
    hasJetson: false,
    hasRealRobot: false,
    preferredLanguages: ['English'],
  });

  const { mutate, isPending } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      email: formData.email,
      password: formData.password,
      profile: {
        ...formData,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />

      {/* Background questions */}
      <div>
        <label>Software Experience:</label>
        <select
          value={formData.softwareExperience}
          onChange={(e) => setFormData({...formData, softwareExperience: e.target.value})}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label>Robotics Experience:</label>
        <select
          value={formData.roboticsExperience}
          onChange={(e) => setFormData({...formData, roboticsExperience: e.target.value})}
        >
          <option value="none">None</option>
          <option value="some">Some</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.hasRTX}
            onChange={(e) => setFormData({...formData, hasRTX: e.target.checked})}
          />
          Access to RTX-class GPU?
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.hasJetson}
            onChange={(e) => setFormData({...formData, hasJetson: e.target.checked})}
          />
          Access to Jetson (Orin Nano/NX)?
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.hasRealRobot}
            onChange={(e) => setFormData({...formData, hasRealRobot: e.target.checked})}
          />
          Access to real robot?
        </label>
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;
```

## Implementation Workflow

### 1. Add Auth State Detection
Create a component to detect and display auth state in your Docusaurus layout:

```tsx
// src/components/Auth/AuthProvider.tsx
import React from 'react';
import { AuthProvider as BetterAuthProvider } from 'better-auth/react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BetterAuthProvider
      config={{
        // Your auth configuration
      }}
    >
      {children}
    </BetterAuthProvider>
  );
};

export default AuthProvider;
```

### 2. Create Personalization Component
Implement a personalization button for chapter pages:

```tsx
// src/components/Personalization/PersonalizeButton.tsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'better-auth/react';

const PersonalizeButton = () => {
  const { data: session } = useSession();
  const [isPersonalized, setIsPersonalized] = useState(false);

  if (!session) {
    return (
      <div className="auth-prompt">
        Log in to personalize this chapter
      </div>
    );
  }

  const togglePersonalization = () => {
    setIsPersonalized(!isPersonalized);
    // Apply personalization logic based on user profile
  };

  return (
    <button
      onClick={togglePersonalization}
      className={`personalize-button ${isPersonalized ? 'active' : ''}`}
    >
      {isPersonalized ? 'Disable Personalization' : 'Personalize this chapter'}
    </button>
  );
};

export default PersonalizeButton;
```

### 3. Create Translation Component
Implement a translation button for chapter pages:

```tsx
// src/components/Translation/TranslateButton.tsx
import React, { useState } from 'react';
import { useSession } from 'better-auth/react';

const TranslateButton = () => {
  const { data: session } = useSession();
  const [isUrdu, setIsUrdu] = useState(false);

  if (!session) {
    return (
      <div className="auth-prompt">
        Log in to translate this chapter
      </div>
    );
  }

  const toggleTranslation = () => {
    setIsUrdu(!isUrdu);
    // Apply translation logic
  };

  return (
    <button
      onClick={toggleTranslation}
      className={`translate-button ${isUrdu ? 'urdu' : 'english'}`}
    >
      {isUrdu ? 'Back to English' : 'Translate to Urdu'}
    </button>
  );
};

export default TranslateButton;
```

## Integration with Chapter Pages

### Adding Components to MDX Files
In your chapter MDX files, add the auth-aware components at the top:

```mdx
---
title: "Chapter Title"
description: "Chapter description"
---

import PersonalizeButton from '@site/src/components/Personalization/PersonalizeButton';
import TranslateButton from '@site/src/components/Translation/TranslateButton';

<div className="chapter-controls">
  <PersonalizeButton />
  <TranslateButton />
</div>

# Chapter Content

Your chapter content here...

## Beginner Section
<div className="beginner-content">
This content is shown to beginner users when personalization is enabled.
</div>

## Advanced Section
<div className="advanced-content">
This content is shown to advanced users when personalization is enabled.
</div>
```

## Testing Your Implementation

### 1. Auth Flow Testing
- Test user registration with background questions
- Verify login functionality
- Check that profile data is properly stored and accessible

### 2. Personalization Testing
- Log in as a beginner user and verify extra explanations appear
- Log in as an advanced user and verify basic sections are collapsed
- Test hardware-based content adaptation

### 3. Translation Testing
- Verify translation toggle functionality
- Check that code blocks remain in English
- Confirm structure (headings, lists) is preserved

## Quality Assurance Checklist

Before deploying, ensure:

- [ ] Auth flows work correctly for signup and signin
- [ ] Profile data is properly collected and stored
- [ ] Personalization adapts content based on user profile
- [ ] Urdu translation preserves technical content
- [ ] All components work within Docusaurus environment
- [ ] No security vulnerabilities in token handling
- [ ] Performance is acceptable with new features
- [ ] Mobile responsiveness is maintained
- [ ] Accessibility standards are met

## Next Steps

1. Deploy your auth backend service
2. Integrate auth components into all chapter pages
3. Create Urdu translations for key chapters
4. Implement personalization rules for different user profiles
5. Test end-to-end user flows
6. Document the feature for other developers