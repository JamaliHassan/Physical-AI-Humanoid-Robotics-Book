# Implementation Plan: RAG Chatbot for Physical AI & Humanoid Robotics Book

**Branch**: `001-rag-chatbot` | **Date**: 2025-12-10 | **Spec**: [link to spec.md](../001-rag-chatbot/spec.md)
**Input**: Feature specification from `/specs/[001-rag-chatbot]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a RAG (Retrieval-Augmented Generation) chatbot for the Physical AI & Humanoid Robotics Book. This feature will extend the static Docusaurus book with a dynamic "AI Teaching Assistant" that allows readers to query specific knowledge from the book content (ROS 2, Isaac Sim, VLA pipelines) without hallucinating general internet knowledge. The system will provide context-aware answers with <3 second latency for retrieval and generation, including a text selection feature that allows users to highlight content and ask AI for explanations.

## Technical Context

**Language/Version**: Python 3.11 (FastAPI backend), TypeScript/JavaScript (React frontend), Node.js 18+ (Docusaurus)
**Primary Dependencies**: FastAPI, OpenAI SDK, Qdrant client, Neon Postgres driver, React, Docusaurus
**Storage**: Qdrant Cloud (vector store), Neon Serverless Postgres (conversation history), Docusaurus static files (book content)
**Testing**: pytest (backend), Jest/React Testing Library (frontend), manual E2E testing
**Target Platform**: Web (GitHub Pages frontend + external API backend)
**Project Type**: Web application (frontend + backend architecture)
**Performance Goals**: <3 seconds response time for 95% of queries, vector search under 1 second
**Constraints**: Must work with GitHub Pages CORS restrictions, serverless cold-start optimization, <95% accuracy in content grounding
**Scale/Scope**: Single book with multiple modules, concurrent user support based on OpenAI/Qdrant limits

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check
- [x] **Spec-First Workflow**: Feature fully specified in `/specs/001-rag-chatbot/spec.md` before implementation
- [x] **Single Source of Truth**: Plan based on existing spec and repository structure
- [x] **Technical Accuracy**: All technology choices verifiable from official documentation
- [x] **Consistency**: Architecture aligns with existing Docusaurus structure
- [x] **Reproducibility**: Implementation will follow established patterns from the constitution
- [x] **Incremental Evolution**: Feature adds to existing book without disrupting current functionality
- [x] **Safety and Integrity**: No secrets or sensitive data included; proper licensing maintained

### Post-Design Check
- [x] **API Design Consistency**: OpenAPI contract follows REST principles and is documented in `/specs/001-rag-chatbot/contracts/chat-api.yaml`
- [x] **Data Model Compliance**: Entity relationships and validation rules documented in `/specs/001-rag-chatbot/data-model.md`
- [x] **Frontend Architecture**: React components follow Docusaurus integration patterns
- [x] **Backend Architecture**: FastAPI structure follows Python/REST best practices
- [x] **Security Compliance**: API keys kept server-side, CORS properly configured
- [x] **Performance Considerations**: Cold-start optimization strategies documented
- [x] **Documentation Completeness**: All design artifacts created and linked properly

## Project Structure

### Documentation (this feature)

```text
specs/001-rag-chatbot/
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
├── app/
│   ├── main.py              # FastAPI application entrypoint
│   ├── routers/
│   │   ├── chat.py          # Chat endpoints
│   │   └── selection.py     # Selection analysis endpoints
│   ├── models/
│   │   ├── chat.py          # Request/response models
│   │   └── database.py      # Database models
│   ├── services/
│   │   ├── rag_service.py   # RAG implementation
│   │   ├── vector_store.py  # Qdrant integration
│   │   ├── database.py      # Neon Postgres integration
│   │   └── llm_service.py   # OpenAI integration
│   └── config.py            # Configuration management
├── scripts/
│   └── ingest.py            # MDX ingestion script
└── requirements.txt         # Python dependencies

src/
├── components/
│   └── Chat/
│       ├── ChatWidget.tsx      # Floating chat UI component
│       ├── ChatWindow.tsx      # Chat interface
│       ├── SelectionListener.tsx # Text selection logic
│       └── styles.module.css   # Chat component styles
└── pages/
    └── index.tsx               # Updated homepage with chat integration

scripts/
└── rag/
    └── ingest.py               # Alternative location for ingestion script

.env                           # Environment configuration (not committed)
```

**Structure Decision**: Web application structure with separate backend API and frontend components integrated with existing Docusaurus site. Backend uses FastAPI for API endpoints and services, while frontend uses React components integrated into Docusaurus layout.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |