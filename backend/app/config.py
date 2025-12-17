import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Qdrant settings - defaults for development
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")

    # Neon Postgres settings
    NEON_DSN: str = os.getenv("NEON_DSN", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Application settings
    APP_NAME: str = "RAG Chatbot API"
    API_V1_STR: str = "/api"

    # Vector settings
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "1536"))  # For text-embedding-3-small

    # Chat settings
    MAX_CONTEXT_TOKENS: int = int(os.getenv("MAX_CONTEXT_TOKENS", "3000"))
    MAX_RESPONSE_TOKENS: int = int(os.getenv("MAX_RESPONSE_TOKENS", "1000"))
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.7"))

settings = Settings()