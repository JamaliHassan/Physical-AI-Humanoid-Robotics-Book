---
description: "Task list for Auth, Personalization & Urdu Translation feature implementation"
---

# Tasks: Auth, Personalization & Urdu Translation

**Input**: Design documents from `/specs/003-auth-personalization-urdu/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No explicit test requirements in the specification - tests are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `src/` (for frontend components)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure per implementation plan
- [X] T002 Initialize backend Node.js project with package.json
- [X] T003 [P] Install better-auth and Hono dependencies for backend
- [X] T004 [P] Install frontend dependencies: better-auth/client, react-query
- [X] T005 Create backend/src directory and basic server file structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Setup backend authentication server with Hono framework in backend/src/server.ts
- [X] T007 Configure better-auth with extended user schema (software_exp, hardware_rtx, hardware_robot, preferred_lang) in backend/src/auth/config.ts
- [X] T008 [P] Setup CORS configuration to allow requests from Docusaurus frontend (localhost:3000)
- [X] T009 [P] Create UserContext provider in src/context/UserContext.tsx for global state management
- [X] T010 Create backend database schema with SQLite for user authentication
- [X] T011 Configure environment variables for backend authentication

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication and Profile Setup (Priority: P1) 🎯 MVP

**Goal**: Implement user signup/signin with modal-based UI and extended profile collection (software experience, hardware access, language preference)

**Independent Test**: User can open auth modal, complete signup with email/password and background questionnaire, account is created with profile data persisted and user context is updated

### Implementation for User Story 1

- [X] T012 [P] [US1] Create AuthModal component with backdrop blur effect in src/components/Auth/AuthModal.tsx
- [X] T013 [P] [US1] Create SigninForm component in src/components/Auth/SigninForm.tsx
- [X] T014 [P] [US1] Create SignupForm component with background questionnaire in src/components/Auth/SignupForm.tsx
- [X] T015 [US1] Implement two-step signup flow (Step 1: email/password, Step 2: profile wizard) in src/components/Auth/AuthModal.tsx
- [X] T016 [US1] Create profile wizard with radio buttons and toggles for background questions in src/components/Auth/SignupForm.tsx
- [X] T017 [US1] Integrate AuthModal with UserContext to update user state in src/theme/Root.tsx
- [X] T018 [US1] Test auth flow with extended profile data collection

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Chapter Content Personalization (Priority: P2)

**Goal**: Enable logged-in users to see content tailored to their experience level and hardware access via a "Personalize Content" button that adapts content based on user profile

**Independent Test**: User can log in with different profiles and verify chapter content adapts appropriately (beginners see extra explanations, users without RTX see simulation-focused content)

### Implementation for User Story 2

- [X] T019 [US2] Create PersonalizedBlock component with requirements prop in src/components/Personalization/PersonalizedBlock.tsx
- [X] T020 [US2] Implement logic to check user profile against requirements in src/components/Personalization/PersonalizedBlock.tsx
- [X] T021 [US2] Create PersonalizeButton component in src/components/Personalization/PersonalizeButton.tsx
- [X] T022 [US2] Create ChapterControlsBar component with pill-shaped buttons in src/components/ChapterControls/ChapterControlsBar.tsx
- [X] T023 [US2] Integrate personalization state into UserContext with isPersonalizedView toggle
- [X] T024 [US2] Add personalization logic to consume user profile and requirements in src/components/Personalization/PersonalizedBlock.tsx
- [ ] T025 [US2] Test personalization with different user profiles

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Urdu Translation (Priority: P3)

**Goal**: Enable logged-in users to see chapter content in Urdu via a "Translate to Urdu" button while preserving code blocks and structure

**Independent Test**: User can log in and verify chapter content translates to Urdu while preserving technical elements and structure

### Implementation for User Story 3

- [X] T026 [US3] Create TranslateButton component in src/components/Translation/TranslateButton.tsx
- [X] T027 [US3] Create UrduContent component to handle translation display in src/components/Translation/UrduContent.tsx
- [X] T028 [US3] Implement translation API endpoints in backend/src/translation/ (GET /api/translations/{contentId})
- [X] T029 [US3] Add translation toggle state to UserContext with isUrduView toggle
- [X] T030 [US3] Integrate translation functionality into ChapterControlsBar component
- [X] T031 [US3] Ensure code blocks and commands remain in English during translation
- [X] T032 [US3] Test Urdu translation functionality with content preservation

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T033 [P] Update theme/Root.tsx to wrap application with UserContext provider
- [X] T034 [P] Add styling with iwind CSS to all new components
- [X] T035 Documentation updates based on quickstart.md
- [X] T036 Run quickstart.md validation to ensure all components work together
- [X] T037 Add error handling for auth modal and personalization components
- [X] T038 Final integration testing of all user stories

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for user authentication but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 for user authentication but should be independently testable

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create AuthModal component with backdrop blur effect in src/components/Auth/AuthModal.tsx"
Task: "Create SigninForm component in src/components/Auth/SigninForm.tsx"
Task: "Create SignupForm component with background questionnaire in src/components/Auth/SignupForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence