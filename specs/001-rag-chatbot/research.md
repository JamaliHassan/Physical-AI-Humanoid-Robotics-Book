# Research: RAG Chatbot for Physical AI & Humanoid Robotics Book

## Architecture Research

### Data Flow Architecture
**Decision**: Docusaurus (Client) → FastAPI (Server) → OpenAI Agents + Qdrant (Vector Search) + Neon (History)
**Rationale**: This architecture provides a clear separation of concerns with the static Docusaurus frontend communicating to a backend service that handles all AI and data operations. This ensures security by keeping API keys server-side while providing the required functionality.

### Component Diagram
- `ChatWidget.tsx`: The floating UI component for chat interaction
- `SelectionListener.tsx`: Logic capturing `window.getSelection()` events for text highlighting
- `ingest.py`: CLI tool for processing MDX files and creating vector embeddings

## Technology Research

### OpenAI Agents SDK Research
**Decision**: Use OpenAI's Assistants API with function calling for RAG integration
**Rationale**: The Assistants API is specifically designed for RAG applications and provides better memory management and conversation context than basic Chat Completions API. It supports file uploads and can be configured to only respond based on provided knowledge.

**Alternatives considered**:
- Basic Chat Completions API with manual context injection: Less reliable for preventing hallucinations
- OpenAI Functions: More complex to implement than Assistants API for this use case

### Qdrant Cloud Research
**Decision**: Use Qdrant Cloud Free Tier with text-embedding-3-small model
**Rationale**: Qdrant provides efficient vector search capabilities and has good Python client support. The Free Tier should be sufficient for the book content size.

**Key findings**:
- Free Tier includes 100K vectors limit
- Supports metadata filtering for source tracking
- Provides efficient similarity search needed for RAG

### Docusaurus Integration Research
**Decision**: Use Docusaurus swizzling to inject Chat Widget globally via Layout wrapper
**Rationale**: Swizzling the Layout component provides a clean way to inject the chat widget on all pages without modifying every individual page.

**Alternatives considered**:
- Root component injection: Less targeted than Layout component
- Manual addition to each page: Not maintainable

## Design Decisions

### Chunking Strategy
**Decision**: Markdown-aware chunking (split by Headers `#`)
**Rationale**: This preserves semantic context of tutorials and maintains coherent sections that make sense when retrieved as context for the AI. Fixed token size could split related content.

**Alternatives considered**:
- Fixed token size (e.g., 500 tokens): Could split related content
- Sentence-level chunking: Would lose semantic structure of tutorials

### Selection UI UX
**Decision**: Tooltip button approach ("Ask AI") instead of automatic chat opening
**Rationale**: This avoids annoying the reader with unexpected UI changes while still providing easy access to the AI feature when needed.

**Alternatives considered**:
- Automatic chat opening: Could be disruptive to reading experience
- Context menu integration: More complex to implement

### Latency Optimization Strategy
**Decision**: Implement connection pooling and warm-up strategies for Neon Serverless
**Rationale**: Serverless databases have cold-start issues. Connection pooling and potential lambda warming will help maintain <3 second response times.

**Approaches**:
- Connection pooling with SQLAlchemy
- Potential use of Neon's connection pooling service
- Caching of frequently accessed vectors

## API Design Research

### Backend Structure
**Decision**: `/backend/app/` directory structure for FastAPI application
**Rationale**: Standard FastAPI project structure that's well-documented and maintainable.

### Frontend Structure
**Decision**: `/src/components/Chat/` for React components
**Rationale**: Organized component structure that follows React best practices and Docusaurus conventions.

### Scripts Structure
**Decision**: `/scripts/rag/` for ingestion logic
**Rationale**: Clear separation of utility scripts from main application code.

## Quality Validation Research

### Context Test Strategy
**Decision**: "Context Test" - Highlight specific paragraph about "ROS 2 Topics", ask "What is this?", verify bot uses highlighted text as primary context
**Rationale**: Validates that the selection feature works properly and the AI uses the provided context appropriately.

### Hallucination Test Strategy
**Decision**: "Hallucination Test" - Ask about unrelated topics like "Baking a Cake", verify bot refuses based on system prompt
**Rationale**: Ensures the AI stays within the book content boundaries and doesn't generate responses based on general knowledge.

## Testing Strategy Research

### Unit Tests
**Decision**: Test the `ingest.py` script to ensure it correctly parses MDX frontmatter
**Rationale**: Critical for data integrity - if the ingestion doesn't work properly, the entire RAG system fails.

### Integration Tests
**Decision**: `pytest` suite checking the `/chat` endpoint against a mock Qdrant instance
**Rationale**: Validates the full flow without requiring external services during testing.

### E2E Tests
**Decision**: Manual verification of the "Highlight -> Ask" flow on deployed site
**Rationale**: Frontend interactions are complex to automate; manual testing ensures proper user experience.

## Technical Implementation Research

### CORS Configuration
**Decision**: Implement CORS in FastAPI to allow requests only from GitHub Pages domain
**Rationale**: Security requirement to prevent unauthorized access to the API from other domains.

### Environment Variables Strategy
- Frontend needs `API_BASE_URL`: Configurable API endpoint
- Backend needs `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `NEON_DSN`: All sensitive credentials kept server-side

## Phasing Strategy

### Phase 1: Data Foundation
**Tasks**: Set up Qdrant/Neon and write the Ingestion Script
**Rationale**: Data foundation must be established before API can function

### Phase 2: API Core
**Tasks**: Build FastAPI endpoints with OpenAI integration
**Rationale**: Core functionality after data is available

### Phase 3: Frontend Integration
**Tasks**: Implement ChatWidget and SelectionListener components
**Rationale**: User interface after backend is ready