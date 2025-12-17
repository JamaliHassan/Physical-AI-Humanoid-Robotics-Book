from typing import List, Dict, Any, Optional
import logging
import uuid
from datetime import datetime

from .vector_store import VectorStoreService
from .llm_service import LLMService
from .database import DatabaseService
from ..models.chat import VectorSearchResult
from ..config import settings

class RAGResponse:
    """
    Response object for RAG service operations
    """
    def __init__(self, answer: str, sources: List[str], session_id: str, related_topics: Optional[List[str]] = None):
        self.answer = answer
        self.sources = sources
        self.session_id = session_id
        self.related_topics = related_topics or []

class RAGService:
    """
    RAG (Retrieval-Augmented Generation) service that combines vector search and LLM
    """

    def __init__(self):
        # Initialize logger first
        self.logger = logging.getLogger(__name__)

        # Initialize services lazily - don't create until needed
        self._vector_store = None
        self._llm_service = None
        self._db_service = None

    @property
    def vector_store(self):
        """Lazy initialization of vector store service"""
        if self._vector_store is None:
            self._vector_store = VectorStoreService()
        return self._vector_store

    @property
    def llm_service(self):
        """Lazy initialization of LLM service"""
        if self._llm_service is None:
            self._llm_service = LLMService()
        return self._llm_service

    @property
    def db_service(self):
        """Lazy initialization of database service"""
        if self._db_service is None:
            self._db_service = DatabaseService()
        return self._db_service

    async def get_response(self, query: str, session_id: str, context_url: Optional[str] = None) -> RAGResponse:
        """
        Get a response for a general query using RAG
        """
        try:
            # Search for relevant chunks in the vector store
            search_results = self.vector_store.search_similar_chunks(query, limit=5)

            # Extract sources from search results
            sources = list(set([result["source_url"] for result in search_results]))

            # Generate response using LLM with context
            answer = self.llm_service.generate_response(query, search_results)

            # Validate the response is grounded in context
            is_valid = self.llm_service.validate_response_against_context(answer, search_results)
            if not is_valid:
                answer = "I cannot provide an answer based on the book content. The information you're looking for may not be available in the provided context."

            # Save conversation to database
            self.db_service.save_conversation(
                session_id=session_id,
                user_query=query,
                bot_response=answer,
                context_url=context_url
            )

            # Extract related topics from the answer (simplified approach)
            related_topics = self._extract_related_topics(answer, search_results)

            return RAGResponse(
                answer=answer,
                sources=sources,
                session_id=session_id,
                related_topics=related_topics
            )
        except Exception as e:
            self.logger.error(f"Error in get_response: {str(e)}")
            raise

    async def analyze_selection(self, selected_text: str, context_url: str, session_id: Optional[str] = None) -> RAGResponse:
        """
        Analyze selected text with context from the book
        """
        try:
            # If no session ID provided, create a new one
            if not session_id:
                session_id = str(uuid.uuid4())

            # Create a specific query for the selected text
            query = f"Explain this text: {selected_text}"

            # Search for similar chunks to the selected text in the same document or related documents
            search_results = self.vector_store.search_similar_chunks(selected_text, limit=3)

            # If we want to focus on the same document as the selection, we could filter results
            # For now, we'll use all results but prioritize the source document
            filtered_results = [r for r in search_results if r["source_url"] == context_url]
            if not filtered_results:
                # If no results from the same document, use all results
                filtered_results = search_results

            # Extract sources
            sources = list(set([result["source_url"] for result in filtered_results]))

            # Generate explanation for the selected text
            answer = self.llm_service.generate_response(query, filtered_results)

            # Validate the response is grounded in context
            is_valid = self.llm_service.validate_response_against_context(answer, filtered_results)
            if not is_valid:
                answer = "I cannot provide an explanation based on the book content. The information you're looking for may not be available in the provided context."

            # Save conversation to database
            self.db_service.save_conversation(
                session_id=session_id,
                user_query=f"Explain selected text: {selected_text}",
                bot_response=answer,
                context_url=context_url
            )

            # Extract related topics
            related_topics = self._extract_related_topics(answer, filtered_results)

            return RAGResponse(
                answer=answer,
                sources=sources,
                session_id=session_id,
                related_topics=related_topics
            )
        except Exception as e:
            self.logger.error(f"Error in analyze_selection: {str(e)}")
            raise

    def _extract_related_topics(self, answer: str, context_chunks: List[Dict[str, Any]]) -> List[str]:
        """
        Extract related topics from the answer and context (simplified implementation)
        """
        # This is a simplified implementation - in a real system you'd use NLP techniques
        # or have a predefined list of topics from the book to match against
        related_topics = []

        # For now, return some placeholder topics based on common robotics/AI concepts
        common_topics = [
            "ROS 2 Concepts", "Isaac Sim", "VLA Pipelines",
            "Robotics Fundamentals", "AI in Robotics",
            "Simulation", "Real Robot Control"
        ]

        answer_lower = answer.lower()
        for topic in common_topics:
            if topic.lower() in answer_lower:
                if topic not in related_topics:
                    related_topics.append(topic)

        return related_topics

    async def get_conversation_history(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Retrieve conversation history for a session
        """
        try:
            conversations = self.db_service.get_conversations_by_session(session_id)
            return [
                {
                    "user_query": conv.user_query,
                    "bot_response": conv.bot_response,
                    "timestamp": conv.timestamp.isoformat() if conv.timestamp else None,
                    "context_url": conv.context_url
                }
                for conv in conversations
            ]
        except Exception as e:
            self.logger.error(f"Error retrieving conversation history: {str(e)}")
            raise