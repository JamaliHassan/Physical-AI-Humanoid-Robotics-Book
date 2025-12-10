# Data Model: Auth, Personalization, and Urdu Translation Bonus Features

## Overview

This document defines the data structures and models for implementing authentication, personalization, and Urdu translation features for the Physical AI & Humanoid Robotics book. The models support user profiles, personalization rules, and translation content.

## User Profile Model

### User Entity
```yaml
User:
  id: string                    # Better Auth user ID
  email: string                 # User's email address (required)
  name: string                  # User's display name (optional)
  createdAt: datetime           # Account creation timestamp
  updatedAt: datetime           # Last profile update timestamp
  profile: UserProfile          # Extended profile information
  preferences: UserPreferences  # User preferences and settings
```

### UserProfile Entity
```yaml
UserProfile:
  softwareExperience: string    # "beginner" | "intermediate" | "advanced"
  roboticsExperience: string    # "none" | "some" | "advanced"
  hardwareAccess: HardwareAccess # Hardware availability flags
  preferredLanguages: [string]  # ["English", "Urdu"] or other language codes
  signupCompleted: boolean      # Whether user completed extended signup
```

### HardwareAccess Entity
```yaml
HardwareAccess:
  hasRTX: boolean               # Access to RTX-class GPU
  hasJetson: boolean            # Access to Jetson (Orin Nano/NX)
  hasRealRobot: boolean         # Access to real robot (quadruped/humanoid)
  robotType: string             # Optional: "quadruped" | "humanoid" | "other"
```

### UserPreferences Entity
```yaml
UserPreferences:
  defaultPersonalization: boolean # Whether to show personalized content by default
  defaultTranslation: string      # Default translation preference: "English" | "Urdu" | "auto"
  lastChapter: string             # Last visited chapter (for resume functionality)
  personalizationEnabled: boolean # Whether personalization is currently enabled
  translationEnabled: boolean     # Whether translation is currently enabled
```

## Personalization Model

### PersonalizationRule Entity
```yaml
PersonalizationRule:
  id: string                    # Unique rule identifier
  name: string                  # Rule name/description
  condition: RuleCondition      # Condition that triggers the rule
  action: RuleAction           # Action to take when condition is met
  priority: integer            # Rule priority (higher number = higher priority)
  enabled: boolean             # Whether rule is active
```

### RuleCondition Entity
```yaml
RuleCondition:
  field: string                 # Profile field to check (e.g., "softwareExperience")
  operator: string              # "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains"
  value: any                    # Value to compare against
  hardwareRequirements: [string] # Required hardware access (e.g., ["hasRTX"])
```

### RuleAction Entity
```yaml
RuleAction:
  type: string                  # "show" | "hide" | "replace" | "highlight"
  target: string                # Target element (e.g., "beginner-section", "advanced-note")
  content: PersonalizationContent # Content modification details
```

### PersonalizationContent Entity
```yaml
PersonalizationContent:
  showExtraExplanations: boolean   # Show additional explanations for beginners
  showSetupGuidance: boolean       # Show detailed setup guidance
  showAdvancedTips: boolean        # Show advanced tips and performance tuning
  emphasizeSimulation: boolean     # Emphasize simulation-only content
  emphasizeRealHardware: boolean   # Emphasize real hardware deployment
  collapseBasicSections: boolean   # Collapse basic content for advanced users
  showSimToRealNotes: boolean      # Show sim-to-real transition notes
```

## Translation Model

### TranslationContent Entity
```yaml
TranslationContent:
  id: string                    # Content identifier (chapter-section format)
  sourceLanguage: string        # Source language code (e.g., "en")
  targetLanguage: string        # Target language code (e.g., "ur")
  sourceContent: TranslationSource # Original content
  translatedContent: TranslationTarget # Translated content
  lastUpdated: datetime         # Last translation update timestamp
  qualityScore: float           # Translation quality score (0-1)
  approved: boolean             # Whether translation has been reviewed
```

### TranslationSource Entity
```yaml
TranslationSource:
  text: string                  # Original text content
  structure: ContentStructure   # Content structure (headings, lists, etc.)
  codeBlocks: [CodeBlock]       # Original code blocks (not translated)
  commands: [string]            # Original commands (not translated)
```

### TranslationTarget Entity
```yaml
TranslationTarget:
  text: string                  # Translated text content
  structure: ContentStructure   # Preserved content structure
  codeBlocks: [CodeBlock]       # Original code blocks (unchanged)
  commands: [string]            # Original commands (unchanged)
```

### ContentStructure Entity
```yaml
ContentStructure:
  headings: [Heading]           # Headings with preserved hierarchy
  lists: [ListItem]            # List items with preserved order
  paragraphs: [string]         # Paragraphs in order
  emphasis: [Emphasis]         # Bold, italic, etc. formatting
```

### CodeBlock Entity
```yaml
CodeBlock:
  id: string                    # Code block identifier
  content: string               # Code content (unchanged in translation)
  language: string              # Code language (python, bash, etc.)
  description: string           # Optional description in source language
```

## Chapter Integration Model

### ChapterPersonalization Entity
```yaml
ChapterPersonalization:
  chapterId: string             # Chapter identifier (e.g., "M1C1")
  personalizationRules: [string] # List of rule IDs that apply to this chapter
  translationAvailable: boolean  # Whether Urdu translation is available
  defaultView: ChapterView      # Default view settings for this chapter
```

### ChapterView Entity
```yaml
ChapterView:
  showPersonalizationToggle: boolean # Whether to show personalization button
  showTranslationToggle: boolean     # Whether to show translation button
  defaultPersonalization: boolean    # Whether personalization is on by default
  defaultTranslation: string         # Default language ("English" | "Urdu")
  userSpecific: UserChapterView      # User-specific view settings
```

### UserChapterView Entity
```yaml
UserChapterView:
  userId: string                # User ID
  chapterId: string             # Chapter ID
  personalizationEnabled: boolean # Whether personalization is enabled
  translationEnabled: boolean   # Whether translation is enabled
  lastViewed: datetime         # Last time chapter was viewed
  timeSpent: integer           # Time spent on chapter in seconds
  completed: boolean           # Whether chapter was completed
```

## Session and State Model

### AuthState Entity
```yaml
AuthState:
  userId: string                # Current user ID
  isLoggedIn: boolean          # Whether user is logged in
  profile: UserProfile         # Current user profile
  sessionToken: string         # Current session token
  expiresAt: datetime          # Session expiration time
```

### ChapterState Entity
```yaml
ChapterState:
  chapterId: string             # Current chapter ID
  personalizationEnabled: boolean # Whether personalization is active
  translationEnabled: boolean   # Whether translation is active
  currentLanguage: string       # Current display language
  contentFilters: [string]      # Active content filters
  viewMode: string              # "default" | "personalized" | "translated" | "both"
```

## Validation Rules

### User Profile Validation
- Email must be valid email format
- Experience levels must be one of defined values
- Hardware access flags must be boolean
- Preferred languages must be valid language codes

### Personalization Rule Validation
- Conditions must reference valid profile fields
- Actions must target valid content elements
- Priority must be a positive integer
- Rules must not conflict with learning objectives

### Translation Content Validation
- Source and target text must maintain semantic meaning
- Code blocks and commands must remain unchanged
- Structure must be preserved in translation
- Quality score must be between 0 and 1

## Relationships

### User to Chapter
- One user can have multiple chapter view states
- One chapter can be viewed by multiple users
- Relationship through UserChapterView entity

### Personalization Rule to Chapter
- One personalization rule can apply to multiple chapters
- One chapter can have multiple applicable rules
- Relationship through ChapterPersonalization entity

### Translation Content to Chapter
- One chapter can have multiple translation languages
- One translation content applies to one chapter
- Relationship through chapterId reference