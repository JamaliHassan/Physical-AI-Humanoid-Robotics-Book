from fastapi import APIRouter, HTTPException
from typing import Optional

from ..models.chat import SelectionAnalysisRequest, SelectionAnalysisResponse
from ..services.rag_service import RAGService

router = APIRouter()

# Lazy initialization of services
def get_rag_service():
    return RAGService()

@router.post("/analyze-selection", response_model=SelectionAnalysisResponse)
async def analyze_selection_endpoint(request: SelectionAnalysisRequest):
    """
    Analyze selected text with context from the book
    """
    try:
        # Validate the request
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Selected text cannot be empty")

        if not request.context_url:
            raise HTTPException(status_code=400, detail="Context URL is required")

        # Analyze the selected text using RAG service (lazy initialization)
        rag_service = get_rag_service()
        response = await rag_service.analyze_selection(
            selected_text=request.text,
            context_url=request.context_url,
            session_id=request.session_id
        )

        return SelectionAnalysisResponse(
            explanation=response.answer,
            related_topics=response.related_topics,
            sources=response.sources
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing selection: {str(e)}")

@router.get("/health")
async def selection_health():
    return {"status": "selection service healthy"}