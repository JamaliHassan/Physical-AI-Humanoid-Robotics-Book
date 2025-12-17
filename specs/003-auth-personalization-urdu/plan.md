# Implementation Plan: Auth, Personalization & Urdu Translation

**Branch**: `003-auth-personalization-urdu` | **Date**: 2025-12-14 | **Spec**: [link to spec.md](spec.md)

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a dual-architecture system with backend authentication server and Docusaurus frontend integration. The system provides user authentication with profile collection, content personalization based on user attributes, and Urdu translation capabilities. The backend server handles authentication with extended user schema, while the frontend provides modal-based UI, global context management, and personalized content rendering. This addresses the previous architectural ambiguity by clearly separating the backend auth server (port 4000) from the Docusaurus frontend to handle SSG limitations.

## Technical Context

**Language/Version**: Node.js (LTS), TypeScript, React 18+
**Primary Dependencies**: `better-auth`, `better-auth/client`, Express/Hono, Docusaurus, React Context API
**Storage**: SQLite database for user authentication, client-side context for session state
**Testing**: Jest for backend, React Testing Library for frontend components
**Target Platform**: Web application (frontend) with Node.js server backend
**Project Type**: Web (dual architecture: backend auth server + frontend Docusaurus)
**Performance Goals**: Sub-2 minute auth flow completion, sub-3 second language toggle, 99.9% availability for user data retrieval
**Constraints**: Must maintain Docusaurus static site generation compatibility, single-page application behavior for auth UI, responsive design for modal components
**Scale/Scope**: Individual book platform with multiple users, profile data per user, per-chapter content adaptation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-First Workflow: Following the established spec from /sp.specify
- ✅ Technical Accuracy: Using documented better-auth and Docusaurus integration patterns
- ✅ Consistency: Maintaining alignment with existing book structure and pedagogy
- ✅ Reproducibility: All integration patterns will be documented for future maintenance
- ✅ Incremental Evolution: Building upon existing Docusaurus structure rather than wholesale changes
- ✅ Tech Stack Compliance: Using Node.js, React, Docusaurus as specified in constitution
- ✅ Build and Deployment: Architecture supports static site generation with backend separation
- ✅ Safety and Integrity: No secrets stored in client code; proper environment handling

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
backend/
├── src/
│   ├── server.js
│   ├── auth/
│   │   ├── index.js
│   │   └── config.js
│   └── middleware/
├── auth.db
└── package.json

src/
├── components/
│   ├── Auth/
│   │   ├── AuthModal.tsx
│   │   ├── SigninForm.tsx
│   │   └── SignupForm.tsx
│   ├── Personalization/
│   │   ├── PersonalizedBlock.tsx
│   │   └── PersonalizeButton.tsx
│   ├── Translation/
│   │   ├── TranslateButton.tsx
│   │   └── UrduContent.tsx
│   └── ChapterControls/
│       └── ChapterControlsBar.tsx
├── context/
│   └── UserContext.tsx
├── services/
│   └── authService.ts
└── theme/
    └── Root.tsx

static/
└── translations/
    └── urdu/
        └── chapters.json

package.json (for backend dependencies)
```

**Structure Decision**: Selected Option 2: Web application structure with separate backend for authentication server and frontend for Docusaurus integration. This follows the specification's requirement for a dual-architecture approach to handle Docusaurus SSG limitations while providing full authentication functionality.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dual architecture (backend + frontend) | Required by Docusaurus SSG limitations for auth | Single Docusaurus app insufficient for authentication state management |
| Extended User schema | Required for personalization features | Basic auth schema insufficient for profile-based content adaptation |