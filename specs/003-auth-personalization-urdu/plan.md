# Implementation Plan: Auth, Personalization, and Urdu Translation Bonus Features

**Branch**: `003-auth-personalization-urdu` | **Date**: 2025-12-10 | **Spec**: [link to spec.md]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of authentication, personalization, and Urdu translation features for the Physical AI & Humanoid Robotics book. The plan includes Better Auth integration for user signup/signin with background capture, chapter-level content personalization based on user profile, and Urdu translation capabilities with toggle functionality. The approach focuses on a phased implementation that integrates seamlessly with the existing Docusaurus book structure.

## Technical Context

**Language/Version**: JavaScript/TypeScript, Node.js 18+, React 18 for Docusaurus v3
**Primary Dependencies**: Better Auth, Docusaurus v3, React, Node.js
**Storage**: Better Auth database for user profiles, optional additional database for translation content
**Testing**: Jest for unit tests, Cypress for integration tests
**Target Platform**: Web-based documentation site (GitHub Pages compatible)
**Project Type**: Web application with frontend and backend components
**Performance Goals**: <3s page load times, <1s auth state detection, <2s translation toggle
**Constraints**: Must integrate with static Docusaurus site, secure handling of auth tokens, minimal data collection
**Scale/Scope**: Target 1000-5000 users, 20-50 chapters with personalization/translation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-First Workflow: Following the established spec from /sp.specify
- ✅ Technical Accuracy: Using documented Better Auth and Docusaurus integration patterns
- ✅ Consistency: Maintaining alignment with existing book structure and pedagogy
- ✅ Reproducibility: All integration patterns will be documented for future maintenance
- ✅ Hardware Realism: Personalization will respect hardware constraints specified in user profiles
- ✅ Visual Verification: UI components will be documented with clear implementation patterns
- ✅ Pedagogical Arc: Personalization will enhance rather than compromise learning objectives

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
src/
├── auth/
│   ├── better-auth.config.ts    # Better Auth configuration
│   ├── middleware.ts           # Auth middleware
│   └── types.ts               # Auth-related types
├── components/
│   ├── Auth/
│   │   ├── SignupForm.tsx     # Signup form with background questions
│   │   ├── SigninForm.tsx     # Signin form
│   │   └── UserProfile.tsx    # User profile display
│   ├── Personalization/
│   │   ├── PersonalizeButton.tsx # Personalize button component
│   │   └── ContentAdapter.tsx    # Component to adapt content based on profile
│   └── Translation/
│       ├── TranslateButton.tsx   # Urdu translation button
│       └── UrduContent.tsx       # Component to display Urdu content
├── pages/
│   └── auth/                  # Auth-related pages
└── lib/
    ├── auth.ts                # Auth utility functions
    ├── personalization.ts     # Personalization logic
    └── translation.ts         # Translation utility functions

docs/
├── module-1-ros2/
├── module-2-digital-twin/
├── module-3-ai-brain/
└── module-4-vla/
    └── ...                    # Each chapter MDX file will include auth components

static/
└── translations/              # Urdu translation files (if pre-generated)
    ├── module-1-ros2/
    ├── module-2-digital-twin/
    ├── module-3-ai-brain/
    └── module-4-vla/
```

**Structure Decision**: Web application with frontend components integrated into Docusaurus MDX pages and backend auth service. The auth system runs separately but integrates seamlessly with the static Docusaurus frontend through client-side components and APIs.

## Phase Breakdown

### Phase 1: Research and Architecture
- Research Better Auth integration patterns with static sites
- Design profile schema and storage approach
- Define personalization model and rules
- Evaluate Urdu translation strategies
- Design frontend access patterns for user profile data

### Phase 2: Auth and Profile Foundation
- Implement Better Auth setup and configuration
- Create signup form with background questions
- Implement signin functionality
- Store user profile data (experience, hardware, language preferences)
- Create frontend components to detect auth state and access profile

### Phase 3: Personalization Model and UI
- Implement personalization rules based on user profile
- Create PersonalizeButton component for chapter pages
- Implement conditional content rendering
- Ensure base content remains accessible
- Test personalization with different user profiles

### Phase 4: Urdu Translation Integration
- Implement Urdu translation strategy (pre-generated or on-demand)
- Create TranslateButton component for chapter pages
- Implement Urdu content display while preserving code/structure
- Add toggle functionality between English/Urdu
- Test translation accuracy and performance

### Phase 5: End-to-End Validation and Documentation
- Integrate all features into chapter pages
- Test complete user flows
- Validate against success criteria
- Create developer documentation
- Document how to add/update personalization and translation content

## Architecture Sketch

### Auth Architecture
- Better Auth runs as a backend service with database storage
- Signup form extends Better Auth with custom fields for background questions
- User profile data stored in Better Auth user model or attached database
- Frontend uses Better Auth client SDK to detect login state and access profile

### Profile Schema and Storage
- Software experience level (beginner/intermediate/advanced)
- Robotics/ROS experience level (none/some/advanced)
- Hardware availability: RTX GPU, Jetson, real robot (boolean flags)
- Preferred language options (English, Urdu, both)
- Stored in Better Auth user profile or attached database table

### Frontend Access Pattern
- Docusaurus site uses Better Auth client SDK to check auth state
- Profile data accessed via client SDK or custom API endpoint
- React components in MDX files handle auth state and profile access
- Session management handled by Better Auth

### Personalization Model
- Client-side conditional rendering based on user profile
- Content sections marked with experience/hardware requirements
- Beginner users see additional explanations and setup guidance
- Advanced users see collapsed basic sections and advanced tips
- Hardware-aware content adapts to user's available resources

### Urdu Translation Strategy
- Pre-translated content stored alongside English content
- Translation files in JSON format mapped to English content
- Code blocks and commands preserved in English
- Toggle functionality implemented with React state management

### UI and UX
- Login/signup links in site header/navigation
- Personalize button at top of each chapter (visible for logged-in users)
- Translate to Urdu button at top of each chapter (visible for logged-in users)
- Visual indicators for current view state (personalized/Urdu)
- Clear toggle options to return to default view

### Security and Privacy
- Minimal data collection (only necessary background information)
- Environment variables for Better Auth secrets
- Secure token handling through Better Auth SDK
- No sensitive data exposed in frontend code

## Decisions Needing Documentation

### 1) Auth Architecture Decision
- **Decision**: Integrate Better Auth directly with Docusaurus frontend using client SDK
- **Rationale**: Provides seamless user experience without redirecting to separate auth app
- **Alternative Considered**: Separate fullstack auth app - rejected for complexity and UX fragmentation

### 2) Profile Storage Decision
- **Decision**: Store extended profile data in attached database table keyed by Better Auth user ID
- **Rationale**: Better Auth user profile has limited extensibility; separate table allows complex profile data
- **Alternative Considered**: Store in Better Auth profile - rejected for schema limitations

### 3) Personalization Model Decision
- **Decision**: Use client-side conditional rendering with React components
- **Rationale**: Provides responsive UI without backend API calls for personalization
- **Alternative Considered**: Backend personalization API - rejected for increased latency

### 4) Urdu Translation Strategy Decision
- **Decision**: Use pre-translated static content stored in JSON files
- **Rationale**: Provides fast translation switching and preserves technical accuracy
- **Alternative Considered**: On-demand LLM translation - rejected for latency and consistency concerns

## Testing Strategy

### 1) Auth and Profile Validation
- New user can sign up and complete background questionnaire
- Existing user can sign in and have profile data available
- Profile data persists across sessions and site visits
- Auth state detection works reliably in Docusaurus environment

### 2) Personalization Behavior Validation
- Beginner user profile shows additional explanations and setup guidance
- Advanced user profile highlights advanced tips and performance tuning
- Hardware-unaware users see simulation-focused content
- Hardware-aware users see real-world deployment considerations
- Base content remains accessible when personalization is disabled

### 3) Urdu Translation Validation
- Urdu translation button correctly switches content to Urdu
- Code blocks and commands remain in English
- Structure (headings, lists) is preserved in translation
- Easy toggle back to English content
- Translation accuracy maintained for technical content

### 4) Integration Validation
- Docusaurus build process completes successfully with new features
- Chapter pages render correctly for both logged-in and logged-out users
- No performance degradation from auth or personalization features
- Core learning content remains accessible regardless of personalization

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Additional backend service | Better Auth requires backend for auth operations | Static-only solution would not support user accounts |
| Database for profile data | Need to store user preferences beyond basic auth | In-memory storage would not persist across sessions |