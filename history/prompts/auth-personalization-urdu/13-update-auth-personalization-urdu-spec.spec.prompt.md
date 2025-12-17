---
id: 13
title: "update-auth-personalization-urdu-spec"
stage: "spec"
date: "2025-12-14"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "auth-personalization-urdu"
branch: "003-auth-personalization-urdu"
user: "Hassan Jamali"
command: "/sp.specify specs/003-auth-personalization-urdu update # Feature Specification: Full Stack Auth, Personalization & Localization"
labels: ["specification", "authentication", "personalization", "localization", "urdu", "docusaurus"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files: []
tests: []
---

# specs/003-auth-personalization-urdu update # Feature Specification: Full Stack Auth, Personalization & Localization

**Context**: Adding dynamic features to an existing Docusaurus static site.
**Status**: Critical Fix (Previous attempt failed due to architectural ambiguity).

## 1. Technical Architecture (Mandatory)
The solution MUST be implemented as two distinct parts to handle Docusaurus SSG limitations:

### Part A: The Auth Server (Backend)
- **Framework**: Create a lightweight Node.js server using Hono or Express (running on port 4000).
- **Library**: Use `better-auth` with a local SQLite database (`auth.db`).
- **Schema Extension**: The User table MUST include these specific columns:
  - `software_exp` (enum: beginner, intermediate, advanced)
  - `hardware_rtx` (boolean)
  - `hardware_robot` (boolean)
  - `preferred_lang` (string)
- **CORS**: Configure to allow requests from the Docusaurus frontend (localhost:3000).

### Part B: The Docusaurus Client (Frontend)
- **Library**: Use `better-auth/client` plugin.
- **State Management**: Create a Global React Context (`UserContext.tsx`) that wraps the application.
  - Stores: `user` object, `isPersonalizedView` (boolean), `isUrduView` (boolean), `userPreferences` (object)
- **Styling**: Use `iwind CSS** strictly. No raw CSS files.
- **Auth UI**:
  - Do NOT create separate `/login` pages.
  - Create a **Modal/Dialog component** (`AuthModal.tsx`) that overlays the content with a backdrop blur (`backdrop-blur-sm bg-black/50`).
  - **Signup Flow**:
    1.  **Step 1**: Standard Email/Password.
    2.  **Step 2**: A "Wizard" style form asking the background questions (clean radio buttons and toggles).
- **Control Bar**:
  - Inject a "Chapter Controls" bar at the top of every Doc item.
  - Contains two pill-shaped buttons: "Personalize Content" and "Translate to Urdu".
  - These buttons function as toggles for the Context state.

## 3. Feature Implementation Details

### Feature: Personalization
- Create a React Component: `<PersonalizedBlock requirements={{ rtx: true, level: 'advanced' }}>`
- **Logic**: Inside the component, consume `UserContext`.
  - If `isPersonalizedView` is false, render children normally.
  - If `isPersonalizedView` is true:
    - Check user profile against `requirements`.
    - If

## Response

The specification has been updated to address the architectural ambiguity that caused the previous attempt to fail. The specification now clearly defines both the backend auth server and frontend Docusaurus integration requirements, with specific technical details for implementation.

Key changes made:
- Clarified the dual-architecture approach (separate backend auth server + Docusaurus frontend)
- Defined specific schema extensions for user profiles
- Specified the global context state management approach
- Outlined the modal-based authentication UI requirements
- Defined the PersonalizedBlock component functionality
- Updated all requirements and success criteria to be more technology-agnostic while maintaining the necessary technical specificity for implementation

The specification is now ready for the planning phase.