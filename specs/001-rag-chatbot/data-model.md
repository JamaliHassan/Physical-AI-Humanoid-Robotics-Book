# Data Model: RAG Chatbot for Physical AI & Humanoid Robotics Book

## Entity: Conversation
**Description**: Represents a single user conversation session with the AI assistant

**Fields**:
- `session_id` (UUID): Unique identifier for the conversation session
- `user_query` (Text): The question or input from the user
- `bot_response` (Text): The AI-generated response to the user query
- `timestamp` (DateTime): When the exchange occurred
- `context_url` (String, Optional): URL of the page where the query originated (for context tracking)

**Validation Rules**:
- `session_id` must be a valid UUID
- `user_query` must not be empty
- `bot_response` must not be empty
- `timestamp` must be in ISO 8601 format

**Relationships**:
- One session_id can have multiple conversation records (one-to-many)

## Entity: Document Chunk
**Description**: Represents a chunk of book content stored in the vector database

**Fields**:
- `chunk_id` (UUID): Unique identifier for the document chunk
- `content` (Text): The actual text content of the chunk
- `source_url` (String): URL path to the original document (e.g., "/docs/module-1/...")
- `embedding` (Vector): The vector representation of the content for similarity search
- `metadata` (JSON): Additional information about the chunk (tokens, section headers, etc.)

**Validation Rules**:
- `chunk_id` must be a valid UUID
- `content` must not be empty
- `source_url` must be a valid relative URL path
- `embedding` must be a valid vector array

**Relationships**:
- No direct relationships (stored in vector database)

## Entity: User Session
**Description**: Represents a user's ongoing interaction with the chat system

**Fields**:
- `session_id` (UUID): Unique identifier for the user session
- `created_at` (DateTime): When the session was started
- `last_activity` (DateTime): When the last interaction occurred
- `active` (Boolean): Whether the session is currently active

**Validation Rules**:
- `session_id` must be a valid UUID
- `created_at` must be before or equal to `last_activity`

**Relationships**:
- Links to multiple Conversation records (one-to-many)

## Entity: Vector Search Result
**Description**: Represents the results from a vector similarity search

**Fields**:
- `chunk_id` (UUID): Reference to the document chunk
- `similarity_score` (Float): How similar this chunk is to the query (0.0-1.0)
- `content` (Text): The content of the matching chunk
- `source_url` (String): URL of the original document

**Validation Rules**:
- `similarity_score` must be between 0.0 and 1.0
- `chunk_id` must be a valid UUID

**Relationships**:
- References Document Chunk (many-to-one)

## Entity: Selection Context
**Description**: Represents the context when a user selects text in the book

**Fields**:
- `selection_id` (UUID): Unique identifier for the selection
- `selected_text` (Text): The exact text that was selected by the user
- `page_url` (String): URL of the page where text was selected
- `surrounding_context` (Text): Text around the selection for additional context
- `timestamp` (DateTime): When the selection was made

**Validation Rules**:
- `selection_id` must be a valid UUID
- `selected_text` must not be empty
- `page_url` must be a valid relative URL path

**Relationships**:
- May link to Conversation if user asks about the selection (one-to-many)