from sqlalchemy import create_engine, Column, String, DateTime, Text, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

Base = declarative_base()

class Conversation(Base):
    """
    Represents a single user conversation session with the AI assistant
    """
    __tablename__ = "conversations"

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_query = Column(Text, nullable=False)  # The question or input from the user
    bot_response = Column(Text, nullable=False)  # The AI-generated response to the user query
    timestamp = Column(DateTime, default=datetime.utcnow)  # When the exchange occurred
    context_url = Column(String, nullable=True)  # URL of the page where the query originated (for context tracking)

class UserSession(Base):
    """
    Represents a user's ongoing interaction with the chat system
    """
    __tablename__ = "user_sessions"

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)  # When the session was started
    last_activity = Column(DateTime, default=datetime.utcnow)  # When the last interaction occurred
    active = Column(Boolean, default=True)  # Whether the session is currently active