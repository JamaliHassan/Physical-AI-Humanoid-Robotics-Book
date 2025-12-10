# API Contract: Auth, Personalization, and Urdu Translation Features

## Overview

This contract defines the API interfaces and integration points for the authentication, personalization, and Urdu translation features in the Physical AI & Humanoid Robotics book. The contract ensures consistent integration between Better Auth, Docusaurus frontend, and any supporting backend services.

## Authentication API Contract

### User Registration Endpoint
```yaml
endpoint: POST /api/auth/register
description: Register a new user with extended profile information
request:
  headers:
    Content-Type: application/json
  body:
    type: object
    properties:
      email:
        type: string
        format: email
        required: true
      password:
        type: string
        minLength: 8
        required: true
      profile:
        type: object
        properties:
          softwareExperience:
            type: string
            enum: ["beginner", "intermediate", "advanced"]
            required: true
          roboticsExperience:
            type: string
            enum: ["none", "some", "advanced"]
            required: true
          hasRTX:
            type: boolean
            required: true
          hasJetson:
            type: boolean
            required: true
          hasRealRobot:
            type: boolean
            required: true
          preferredLanguages:
            type: array
            items:
              type: string
              enum: ["English", "Urdu"]
            required: true
responses:
  200:
    description: User successfully registered
    body:
      type: object
      properties:
        user:
          type: object
          properties:
            id: string
            email: string
            profile: UserProfile
        session:
          type: object
          properties:
            token: string
            expiresAt: string
  400:
    description: Invalid input data
  409:
    description: User already exists
```

### User Login Endpoint
```yaml
endpoint: POST /api/auth/login
description: Authenticate user and return session
request:
  headers:
    Content-Type: application/json
  body:
    type: object
    properties:
      email:
        type: string
        format: email
        required: true
      password:
        type: string
        required: true
responses:
  200:
    description: User successfully authenticated
    body:
      type: object
      properties:
        user:
          type: object
          properties:
            id: string
            email: string
            profile: UserProfile
        session:
          type: object
          properties:
            token: string
            expiresAt: string
  401:
    description: Invalid credentials
```

### Get User Profile Endpoint
```yaml
endpoint: GET /api/auth/profile
description: Retrieve current user's profile information
request:
  headers:
    Authorization: Bearer {token}
    required: true
responses:
  200:
    description: User profile retrieved successfully
    body:
      type: object
      properties:
        id: string
        email: string
        profile: UserProfile
        preferences: UserPreferences
  401:
    description: Unauthorized - invalid or expired token
```

## Personalization API Contract

### Get Personalization Rules for Chapter
```yaml
endpoint: GET /api/personalization/rules/{chapterId}
description: Retrieve personalization rules applicable to a specific chapter
request:
  path:
    chapterId: string (e.g., "M1C1")
  headers:
    Authorization: Bearer {token}
    required: true
responses:
  200:
    description: Personalization rules for the chapter
    body:
      type: object
      properties:
        chapterId: string
        rules: [PersonalizationRule]
        applicableToUser: boolean
  401:
    description: Unauthorized - invalid or expired token
  404:
    description: Chapter not found
```

### Apply Personalization to Content
```yaml
endpoint: POST /api/personalization/apply
description: Apply personalization rules to content based on user profile
request:
  headers:
    Authorization: Bearer {token}
    required: true
    Content-Type: application/json
  body:
    type: object
    properties:
      chapterId: string
      content: string
      userProfile: UserProfile
responses:
  200:
    description: Personalized content returned
    body:
      type: object
      properties:
        originalContent: string
        personalizedContent: string
        appliedRules: [string]
        personalizationSummary: string
  401:
    description: Unauthorized - invalid or expired token
```

## Translation API Contract

### Get Urdu Translation for Chapter
```yaml
endpoint: GET /api/translation/urdu/{chapterId}
description: Retrieve Urdu translation for a specific chapter
request:
  path:
    chapterId: string (e.g., "M1C1")
  headers:
    Authorization: Bearer {token}
    required: true
responses:
  200:
    description: Urdu translation retrieved successfully
    body:
      type: object
      properties:
        chapterId: string
        sourceLanguage: string
        targetLanguage: string
        content:
          type: object
          properties:
            headings: [TranslationSegment]
            paragraphs: [TranslationSegment]
            codeBlocks: [CodeBlock]
            lists: [ListItem]
        lastUpdated: string
        qualityScore: number
  401:
    description: Unauthorized - invalid or expired token
  404:
    description: Translation not available for this chapter
```

### Toggle Translation State
```yaml
endpoint: POST /api/translation/toggle
description: Update user's translation preference for a chapter
request:
  headers:
    Authorization: Bearer {token}
    required: true
    Content-Type: application/json
  body:
    type: object
    properties:
      chapterId: string
      enableTranslation: boolean
responses:
  200:
    description: Translation preference updated
    body:
      type: object
      properties:
        chapterId: string
        translationEnabled: boolean
        message: string
  401:
    description: Unauthorized - invalid or expired token
```

## Data Models

### UserProfile Model
```yaml
UserProfile:
  softwareExperience: string (enum: beginner, intermediate, advanced)
  roboticsExperience: string (enum: none, some, advanced)
  hardwareAccess:
    hasRTX: boolean
    hasJetson: boolean
    hasRealRobot: boolean
  preferredLanguages: [string] (enum: English, Urdu)
```

### UserPreferences Model
```yaml
UserPreferences:
  defaultPersonalization: boolean
  defaultTranslation: string (enum: English, Urdu, auto)
  lastChapter: string
  personalizationEnabled: boolean
  translationEnabled: boolean
```

### PersonalizationRule Model
```yaml
PersonalizationRule:
  id: string
  name: string
  condition:
    field: string
    operator: string (enum: equals, notEquals, greaterThan, lessThan, contains)
    value: any
    hardwareRequirements: [string]
  action:
    type: string (enum: show, hide, replace, highlight)
    target: string
    content: PersonalizationContent
  priority: integer
  enabled: boolean
```

### PersonalizationContent Model
```yaml
PersonalizationContent:
  showExtraExplanations: boolean
  showSetupGuidance: boolean
  showAdvancedTips: boolean
  emphasizeSimulation: boolean
  emphasizeRealHardware: boolean
  collapseBasicSections: boolean
  showSimToRealNotes: boolean
```

### TranslationSegment Model
```yaml
TranslationSegment:
  id: string
  sourceText: string
  translatedText: string
  type: string (enum: heading, paragraph, list-item)
  preservedElements: [PreservedElement]
```

### CodeBlock Model
```yaml
CodeBlock:
  id: string
  content: string (unchanged in translation)
  language: string
  description: string (in source language)
```

## Integration Requirements

### Frontend Integration
- All API endpoints must be accessible from browser environment
- Proper CORS configuration for cross-origin requests
- Error handling for network failures
- Loading states for async operations

### Security Requirements
- All endpoints requiring authentication must validate tokens
- Sensitive data must not be exposed in client responses
- Rate limiting to prevent abuse
- Input validation for all request parameters

### Performance Requirements
- API responses must be <500ms for 95th percentile
- Translation content should be cached for repeated requests
- Personalization rules should be pre-computed when possible
- Session tokens should have reasonable expiration times

## Error Handling

### Standard Error Response
```yaml
error:
  type: object
  properties:
    error:
      type: string (error code)
    message:
      type: string (human-readable error message)
    details:
      type: object (optional, additional error details)
```

### Common Error Codes
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: User not found
- `PER_001`: Personalization rule not found
- `TRANS_001`: Translation not available
- `TRANS_002`: Invalid language code
- `VALID_001`: Validation error
- `SYS_001`: System error