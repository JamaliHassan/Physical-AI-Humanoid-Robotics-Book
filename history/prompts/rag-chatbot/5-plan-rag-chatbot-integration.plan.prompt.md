---
id: 5
title: "plan-rag-chatbot-integration"
stage: "plan"
date: "2025-12-10"
model: "Claude Sonnet 4.5"
feature: "rag-chatbot"
branch: "001-rag-chatbot"
user: "Hassan Jamali"
command: "/sp.plan"
labels: ["plan", "ai", "chatbot", "rag", "education"]
links:
  spec: "../001-rag-chatbot/spec.md"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "specs/001-rag-chatbot/plan.md"
  - "specs/001-rag-chatbot/research.md"
  - "specs/001-rag-chatbot/data-model.md"
  - "specs/001-rag-chatbot/quickstart.md"
  - "specs/001-rag-chatbot/contracts/chat-api.yaml"
  - "specs/001-rag-chatbot/checklists/requirements.md"
tests: []
---

# PHR: plan-rag-chatbot-integration

## User Input

```
 Project: Physical AI Book — Integrated RAG Chatbot

Create:
- **Architecture Sketch:**
  - **Data Flow:** Docusaurus (Client) → FastAPI (Server) → OpenAI Agents + Qdrant (Vector Search) + Neon (History).
  - **Component Diagram:**
    - `ChatWidget.tsx`: The floating UI.
    - `SelectionListener.tsx`: The logic capturing `window.getSelection()` events.
    - `ingest.py`: The CLI tool for processing MDX files.
- **Section Structure:**
  - Backend: `/backend/app/` (routers, agents, db connections).
  - Frontend: `/src/components/Chat/` (React components).
  - Scripts: `/scripts/rag/` (Ingestion logic).
- **Research Approach:**
  - **OpenAI Agents SDK:** Verify implementation patterns for "Function Calling" vs "RAG Integration".
  - **Qdrant Cloud:** Confirm API key permissions and Free Tier collection limits (vectors count).
  - **Docusaurus Swizzling:** Determine the cleanest way to inject the Chat Widget globally (prefer `<Layout>` wrapper).
- **Quality Validation:**
  - **The "Context" Test:** Highlight a specific paragraph about "ROS 2 Topics", ask "What is this?", and verify the bot uses the highlighted text as primary context.
  - **The "Hallucination" Test:** Ask a question about "Baking a Cake" (Bot should refuse based on System Prompt).

Decisions needing documentation:
- **Chunking Strategy:**
  - Option A: Fixed token size (e.g., 500 tokens).
  - Option B: Markdown-aware chunking (split by Headers `#`). *Decision: Use Markdown-aware to preserve semantic context of tutorials.*
- **Selection UI UX:**
  - Should the chat open automatically on selection, or show a tooltip button ("Ask AI") first? *Decision: Tooltip button to avoid annoying the reader.*
- **Latency Optimization:**
  - Strategy for minimizing cold-starts on Neon Serverless.

Testing strategy:
- **Unit Tests:** Test the `ingest.py` script to ensure it correctly parses MDX frontmatter.
- **Integration Tests:** `pytest` suite checking the `/chat` endpoint against a mock Qdrant instance.
- **E2E Tests:** Manual verification of the "Highlight -> Ask" flow on the deployed GitHub Pages site (checking CORS).

Technical details:
- **Tech Stack:** FastAPI, OpenAI ChatKit, Neon Postgres, Qdrant Cloud.
- **Phasing:**
  1.  **Data Foundation:** Set up Qdrant/Neon and write the Ingestion Script.
  2.  **API Core:** Build FastAPI endpoints with OpenAI Agents SDK.
  3.  *
```

## Response Summary

Completed comprehensive planning for the RAG Chatbot integration with the Physical AI & Humanoid Robotics Book. The planning included:

- Created detailed implementation plan with technical context and architecture decisions
- Developed research document with technology evaluations and design decisions
- Designed data models for conversation, document chunks, and selection context
- Created OpenAPI contract for the chat API endpoints
- Developed quickstart guide for setup and deployment
- Updated constitution check to validate post-design compliance

Key architectural decisions were documented including the use of Markdown-aware chunking for better semantic preservation, tooltip-based UI for text selection to avoid disrupting the reader, and latency optimization strategies for serverless database cold-starts.

## Outcome

Planning phase complete with all required artifacts created. The implementation plan provides a clear roadmap for developing the RAG chatbot with defined architecture, data models, API contracts, and deployment strategy. Ready to proceed to task generation phase (`/sp.tasks`).

## Evaluation

The planning successfully translates the feature specification into concrete implementation artifacts with proper technical architecture, data models, and API contracts. All user requirements from the original input have been addressed in the planning documents, with clear separation of concerns between frontend, backend, and data components. The plan maintains alignment with the project constitution while providing the advanced AI functionality requested.