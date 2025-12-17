from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
import uuid
from pydantic import BaseModel

from ..models.chat import ChatRequest, ChatResponse
from ..services.rag_service import RAGService
from ..services.llm_service import LLMService
from ..config import settings

router = APIRouter()

# Lazy initialization of services
def get_rag_service():
    return RAGService()

def get_llm_service():
    return LLMService()

class ChatSession:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.messages = []

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest):
    """
    General Q&A endpoint for the RAG chatbot
    """
    try:
        # Validate the request
        if not chat_request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Generate response using RAG service (lazy initialization)
        rag_service = get_rag_service()
        response = await rag_service.get_response(
            query=chat_request.message,
            session_id=chat_request.session_id or str(uuid.uuid4()),
            context_url=chat_request.context_url
        )

        return ChatResponse(
            response=response.answer,
            sources=response.sources,
            session_id=response.session_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")

@router.get("/health")
async def chat_health():
    return {"status": "chat service healthy"}