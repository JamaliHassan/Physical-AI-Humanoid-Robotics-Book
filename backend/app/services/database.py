from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
from contextlib import contextmanager
from sqlalchemy.pool import StaticPool
import logging
from typing import Generator, Optional
from datetime import datetime

from ..models.database import Base, Conversation, UserSession
from ..config import settings

# Initialize database engine lazily
engine = None
SessionLocal = None

def init_db():
    global engine, SessionLocal
    try:
        if engine is None:
            # Use SQLite as fallback for development if no database URL is provided
            db_url = settings.NEON_DSN or settings.DATABASE_URL or "sqlite:///rag_local.db"
            engine = create_engine(db_url, pool_pre_ping=True)
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning: Could not initialize database: {e}")
        # Create a mock engine that won't crash the application
        engine = create_engine("sqlite:///:memory:", poolclass=StaticPool)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base.metadata.create_all(bind=engine)

# Initialize the database
init_db()

class DatabaseService:
    """
    Service for Neon Postgres database integration
    """

    def __init__(self):
        self.engine = engine
        self.SessionLocal = SessionLocal
        self.logger = logging.getLogger(__name__)

    @contextmanager
    def get_db_session(self) -> Generator[Session, None, None]:
        """
        Context manager for database sessions
        """
        db = self.SessionLocal()
        try:
            yield db
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            self.logger.error(f"Database error: {str(e)}")
            raise
        finally:
            db.close()

    def save_conversation(self, session_id: str, user_query: str, bot_response: str, context_url: Optional[str] = None):
        """
        Save a conversation record to the database
        """
        try:
            with self.get_db_session() as db:
                conversation = Conversation(
                    session_id=session_id,
                    user_query=user_query,
                    bot_response=bot_response,
                    context_url=context_url
                )
                db.add(conversation)
                db.commit()
                db.refresh(conversation)
                return conversation
        except Exception as e:
            self.logger.error(f"Error saving conversation: {str(e)}")
            raise

    def get_conversations_by_session(self, session_id: str):
        """
        Retrieve conversations for a specific session
        """
        try:
            with self.get_db_session() as db:
                conversations = db.query(Conversation).filter(Conversation.session_id == session_id).all()
                return conversations
        except Exception as e:
            self.logger.error(f"Error retrieving conversations: {str(e)}")
            raise

    def create_user_session(self, session_id: Optional[str] = None):
        """
        Create a new user session
        """
        try:
            with self.get_db_session() as db:
                user_session = UserSession(session_id=session_id)
                db.add(user_session)
                db.commit()
                db.refresh(user_session)
                return user_session
        except Exception as e:
            self.logger.error(f"Error creating user session: {str(e)}")
            raise

    def update_session_activity(self, session_id: str):
        """
        Update the last activity timestamp for a session
        """
        try:
            with self.get_db_session() as db:
                user_session = db.query(UserSession).filter(UserSession.session_id == session_id).first()
                if user_session:
                    user_session.last_activity = datetime.utcnow()
                    db.commit()
        except Exception as e:
            self.logger.error(f"Error updating session activity: {str(e)}")
            raise