from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's message or question")
    session_id: Optional[str] = Field(None, description="Session ID to maintain conversation context")
    context_url: Optional[str] = Field(None, description="URL of the page where the query originated")

class ChatResponse(BaseModel):
    response: str = Field(..., description="The AI-generated response")
    sources: List[str] = Field(default_factory=list, description="List of source URLs for the information")
    session_id: str = Field(..., description="The session ID for the conversation")

class SelectionAnalysisRequest(BaseModel):
    text: str = Field(..., description="The selected text to analyze")
    context_url: str = Field(..., description="URL of the page where text was selected")
    session_id: Optional[str] = Field(None, description="Session ID to maintain context")

class SelectionAnalysisResponse(BaseModel):
    explanation: str = Field(..., description="Explanation of the selected text")
    related_topics: List[str] = Field(default_factory=list, description="Related topics from the book")
    sources: List[str] = Field(default_factory=list, description="List of source URLs for the information")

class ConversationRecord(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique identifier for the conversation session")
    user_query: str = Field(..., description="The question or input from the user")
    bot_response: str = Field(..., description="The AI-generated response to the user query")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="When the exchange occurred")
    context_url: Optional[str] = Field(None, description="URL of the page where the query originated (for context tracking)")

class DocumentChunk(BaseModel):
    chunk_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique identifier for the document chunk")
    content: str = Field(..., description="The actual text content of the chunk")
    source_url: str = Field(..., description="URL path to the original document")
    embedding: Optional[List[float]] = Field(None, description="The vector representation of the content")
    metadata: dict = Field(default_factory=dict, description="Additional information about the chunk")

class VectorSearchResult(BaseModel):
    chunk_id: str = Field(..., description="Reference to the document chunk")
    similarity_score: float = Field(..., description="How similar this chunk is to the query (0.0-1.0)")
    content: str = Field(..., description="The content of the matching chunk")
    source_url: str = Field(..., description="URL of the original document")

class SelectionContext(BaseModel):
    selection_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique identifier for the selection")
    selected_text: str = Field(..., description="The exact text that was selected by the user")
    page_url: str = Field(..., description="URL of the page where text was selected")
    surrounding_context: Optional[str] = Field(None, description="Text around the selection for additional context")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="When the selection was made")