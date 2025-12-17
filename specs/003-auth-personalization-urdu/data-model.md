# Data Model: Auth, Personalization & Urdu Translation

## Overview

This document defines the data structures and models for implementing authentication, personalization, and Urdu translation features using the dual-architecture approach. The models support user profiles with specific schema extensions, personalization rules, and translation content while addressing Docusaurus SSG limitations.

## User Profile Model

### User Entity
```yaml
User:
  id: string                    # Better Auth user ID
  email: string                 # User's email address (required)
  name: string                  # User's display name (optional)
  createdAt: datetime           # Account creation timestamp
  updatedAt: datetime           # Last profile update timestamp
  software_exp: string          # User's software experience level: "beginner" | "intermediate" | "advanced"
  hardware_rtx: boolean         # Whether user has access to RTX-class GPU
  hardware_robot: boolean       # Whether user has access to real robot (quadruped/humanoid)
  preferred_lang: string        # User's preferred language (e.g., "en", "ur")
```

### User Context Entity (Frontend State)
```yaml
UserContext:
  user: User                    # The authenticated user object (null if not authenticated)
  isPersonalizedView: boolean   # Whether personalization is currently active
  isUrduView: boolean           # Whether Urdu translation is currently active
  userPreferences: object       # Additional user preferences for the current session
```

## Personalization Model

### PersonalizedBlock Entity
```yaml
PersonalizedBlock:
  id: string                    # Unique component identifier
  requirements: object          # Requirements for showing content: {rtx: boolean, level: string}
  children: string              # Content to conditionally render
  isVisible: boolean            # Whether content should be visible based on user profile
```

### PersonalizationRule Entity
```yaml
PersonalizationRule:
  id: string                    # Unique rule identifier
  contentSelector: string       # CSS selector or component identifier for targeted content
  requirements: object          # User profile requirements to show content: {rtx: true, level: "advanced"}
  action: string                # "show" | "hide" based on requirements match
  priority: integer             # Rule priority (higher number = higher priority)
```

## Translation Model

### TranslationContent Entity
```yaml
TranslationContent:
  id: string                    # Content identifier (chapter identifier)
  sourceLanguage: string        # Source language code (e.g., "en")
  targetLanguage: string        # Target language code (e.g., "ur")
  sourceContent: string         # Original English content
  translatedContent: string     # Translated Urdu content
  lastUpdated: datetime         # Last translation update timestamp
```

### UrduTranslation Entity
```yaml
UrduTranslation:
  contentId: string             # Reference to the original content
  urduText: string              # Urdu translation of the content
  preservedElements: [object]   # Elements to preserve in translation (code blocks, commands)
  createdAt: datetime           # Translation creation timestamp
  updatedAt: datetime           # Last update to translation
```

## Chapter Integration Model

### ChapterControls Entity
```yaml
ChapterControls:
  chapterId: string             # Chapter identifier
  showPersonalizeButton: boolean # Whether to show "Personalize Content" button
  showTranslateButton: boolean   # Whether to show "Translate to Urdu" button
  isPersonalizedView: boolean    # Current personalization toggle state
  isUrduView: boolean           # Current translation toggle state
```

## Component State Model

### ModalState Entity
```yaml
ModalState:
  isOpen: boolean               # Whether authentication modal is open
  currentStep: string           # Current step in auth flow: "signin" | "signup" | "profile-wizard"
  authType: string              # Type of authentication: "signin" | "signup"
```

### PersonalizationState Entity
```yaml
PersonalizationState:
  isEnabled: boolean            # Whether personalization is currently enabled
  activeFilters: [object]       # Currently active personalization filters
  userRequirements: object      # User's profile requirements for content filtering
```

## Validation Rules

### User Profile Validation
- Email must be valid email format
- software_exp must be one of: "beginner", "intermediate", "advanced"
- hardware_rtx and hardware_robot must be boolean values
- preferred_lang must be a valid language code

### Personalization Validation
- PersonalizedBlock requirements must match user profile structure
- Content visibility must be determined by user profile vs. requirements comparison
- Default (non-personalized) content must remain accessible

### Translation Validation
- Urdu translation must preserve technical accuracy
- Code blocks and commands must remain in English
- Content structure (headings, lists) must be preserved
- Translation toggling must be reversible

## Relationships

### User to Personalization
- One user has one profile with personalization attributes
- Multiple PersonalizedBlock components may reference one user's profile

### Content to Translation
- One English content item can have one Urdu translation
- Translation relationship maintained through contentId reference

### Chapter to Controls
- One chapter has one set of control settings
- Controls determine which UI elements are shown to users