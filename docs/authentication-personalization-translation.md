# Authentication, Personalization, and Translation Features

This document explains how to use the authentication, personalization, and translation features implemented in the Physical AI & Humanoid Robotics book.

## Authentication

The book uses Better Auth for user authentication. The system collects additional profile information during signup to enable personalization.

### Components

- `SignupForm`: Registration form with background questions
- `SigninForm`: Login form
- `AuthProvider`: Context provider for authentication state

### Profile Collection

During signup, users provide information about:
- Software experience level (beginner, intermediate, advanced)
- Robotics/ROS experience level
- Hardware access (RTX GPU, Jetson, real robot)
- Preferred languages

## Personalization

Content is adapted based on the user's profile to provide an optimal learning experience.

### Components

- `PersonalizeButton`: Toggle button to enable/disable personalization
- `ContentAdapter`: Component that adapts content based on user profile
- `personalization.ts`: Utility functions for personalization logic

### Personalization Logic

The system adapts content based on:
- User's experience level
- Hardware access
- Learning preferences

## Translation

The book supports Urdu translation to make content accessible to a wider audience.

### Components

- `TranslateButton`: Toggle button to switch between English and Urdu
- `UrduContent`: Component for bilingual content display
- `translation.ts`: Utility functions for translation

### Translation Approach

The system uses:
- Pre-translated content where available
- Glossary-based translation as fallback
- Proper RTL styling for Urdu content

## Integration with Docusaurus

The authentication system is integrated at the theme level through the `Root` component, which wraps the entire application with authentication context.

## Usage Examples

### In MDX Files

```mdx
import PersonalizeButton from '@site/src/components/Personalization/PersonalizeButton';
import TranslateButton from '@site/src/components/Translation/TranslateButton';
import ContentAdapter from '@site/src/components/Personalization/ContentAdapter';

<PersonalizeButton chapterId="chapter-1" />

<ContentAdapter
  chapterId="chapter-1"
  content={{
    beginner: <div>Beginner content</div>,
    intermediate: <div>Intermediate content</div>,
    advanced: <div>Advanced content</div>
  }}
/>
```

### Environment Variables

Create a `.env` file with the following variables:

```env
BETTER_AUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
```