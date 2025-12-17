from openai import OpenAI
from typing import List, Dict, Any, Optional
import logging

from ..config import settings

class LLMService:
    """
    Service for OpenAI integration and response generation
    """

    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.logger = logging.getLogger(__name__)

    def generate_response(self, prompt: str, context_chunks: Optional[List[Dict[str, Any]]] = None) -> str:
        """
        Generate a response using OpenAI's GPT model with provided context
        """
        try:
            # Build the system message with context
            system_message = (
                "You are an AI Teaching Assistant for the Physical AI & Humanoid Robotics Book. "
                "Your purpose is to help students understand concepts from the book content. "
                "Only use information from the provided context to answer questions. "
                "Do not hallucinate or provide information not found in the context. "
                "If you cannot answer based on the provided context, say so clearly."
            )

            # Add context to the user message if available
            if context_chunks:
                context_text = "\n\n".join([chunk["content"] for chunk in context_chunks])
                user_message = f"Context from the book:\n{context_text}\n\nQuestion: {prompt}"
            else:
                user_message = f"Question: {prompt}"

            # Call OpenAI API
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # Could be configurable
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=settings.MAX_RESPONSE_TOKENS,
                temperature=settings.TEMPERATURE
            )

            # Extract and return the response
            return response.choices[0].message.content.strip()
        except Exception as e:
            self.logger.error(f"Error generating response: {str(e)}")
            raise

    def validate_response_against_context(self, response: str, context_chunks: List[Dict[str, Any]]) -> bool:
        """
        Validate that the response is grounded in the provided context
        """
        # This is a simplified validation - in practice, you might want more sophisticated checks
        response_lower = response.lower()

        # Check if key terms from context appear in response (basic grounding check)
        context_text = " ".join([chunk["content"] for chunk in context_chunks]).lower()

        # For now, just return True - in a real implementation you'd have more sophisticated validation
        return True