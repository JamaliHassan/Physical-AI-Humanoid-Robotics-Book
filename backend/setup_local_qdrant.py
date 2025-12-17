#!/usr/bin/env python3
"""
Setup script to run a local Qdrant instance using Python Qdrant client's in-memory mode
This allows development without Docker
"""

import os
import sys
import subprocess
import time
import requests
from pathlib import Path

def check_port(port):
    """Check if a port is available"""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) != 0

def setup_local_qdrant():
    """Setup local Qdrant for development"""
    print("Setting up local Qdrant for development...")

    # Check if port 6333 is available
    if not check_port(6333):
        print("Port 6333 is already in use. Please stop any existing Qdrant instance.")
        return False

    print("Qdrant requires Docker to run properly. For development without Docker, you have two options:")
    print()
    print("OPTION 1: Install Docker Desktop (Recommended)")
    print("  - Download from: https://www.docker.com/products/docker-desktop")
    print("  - After installation, run: docker run -d --name qdrant-local -p 6333:6333 qdrant/qdrant")
    print()
    print("OPTION 2: Use Qdrant Cloud (Free tier available)")
    print("  - Sign up at: https://cloud.qdrant.io/")
    print("  - Get your URL and API key from the dashboard")
    print()
    print("For a temporary development solution, we can modify the vector store to use a simple in-memory store.")

    # Ask user for preference
    choice = input("\nWould you like me to create a temporary in-memory vector store? (y/n): ").lower().strip()

    if choice == 'y':
        create_temp_vector_store()
        return True
    else:
        print("\nPlease install Docker or sign up for Qdrant Cloud, then run this script again.")
        return False

def create_temp_vector_store():
    """Create a temporary in-memory vector store as a fallback"""
    print("\nCreating temporary in-memory vector store...")

    # Create a temporary vector store implementation
    temp_vector_store_content = '''from typing import List, Optional, Dict, Any
import logging
import uuid
import numpy as np
from numpy.linalg import norm
import pickle
import os
from datetime import datetime

from ..config import settings

class VectorStoreService:
    """
    Temporary in-memory vector store for development without Qdrant
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.documents = {}  # {chunk_id: {"content": ..., "source_url": ..., "metadata": ..., "embedding": ...}}
        self.collection_name = "document_chunks"
        self._load_from_disk()  # Load any existing data from disk

    def _load_from_disk(self):
        """Load vector store from disk if it exists"""
        try:
            cache_file = "temp_vector_store.pkl"
            if os.path.exists(cache_file):
                with open(cache_file, 'rb') as f:
                    self.documents = pickle.load(f)
                self.logger.info(f"Loaded {len(self.documents)} documents from disk")
        except Exception as e:
            self.logger.warning(f"Could not load vector store from disk: {e}")

    def _save_to_disk(self):
        """Save vector store to disk"""
        try:
            cache_file = "temp_vector_store.pkl"
            with open(cache_file, 'wb') as f:
                pickle.dump(self.documents, f)
        except Exception as e:
            self.logger.error(f"Could not save vector store to disk: {e}")

    def _cosine_similarity(self, a, b):
        """Calculate cosine similarity between two vectors"""
        if len(a) != len(b):
            return 0.0
        dot_product = sum(i * j for i, j in zip(a, b))
        norm_a = sum(i * i for i in a) ** 0.5
        norm_b = sum(i * i for i in b) ** 0.5
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot_product / (norm_a * norm_b)

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate a simple embedding for the given text using a basic approach
        In production, this would use OpenAI or another embedding service
        """
        try:
            # For development, create a simple hash-based embedding
            # This is NOT a real embedding but will allow the system to function
            import hashlib

            # Use OpenAI if API key is available
            if settings.OPENAI_API_KEY:
                from openai import OpenAI
                client = OpenAI(api_key=settings.OPENAI_API_KEY)

                response = client.embeddings.create(
                    input=text,
                    model=settings.EMBEDDING_MODEL or "text-embedding-3-small"
                )
                return response.data[0].embedding
            else:
                # Fallback: simple hash-based embedding (not semantically meaningful)
                # This is only for development without API keys
                text_hash = hashlib.sha256(text.encode()).hexdigest()
                # Convert hex to numbers and normalize
                embedding = []
                for i in range(0, len(text_hash), 2):
                    hex_pair = text_hash[i:i+2]
                    val = int(hex_pair, 16) / 255.0  # Normalize to 0-1
                    embedding.append(val)

                # Pad or truncate to expected size (1536 for text-embedding-3-small)
                target_size = settings.EMBEDDING_DIMENSION or 1536
                if len(embedding) < target_size:
                    embedding.extend([0.0] * (target_size - len(embedding)))
                elif len(embedding) > target_size:
                    embedding = embedding[:target_size]

                return embedding
        except Exception as e:
            self.logger.error(f"Error generating embedding: {str(e)}")
            # Return a random embedding as fallback
            import random
            return [random.random() for _ in range(settings.EMBEDDING_DIMENSION or 1536)]

    def store_document_chunk(self, content: str, source_url: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        Store a document chunk in the temporary vector store
        """
        try:
            # Generate embedding for the content
            embedding = self.generate_embedding(content)

            # Create a unique ID for this chunk
            chunk_id = str(uuid.uuid4())

            # Store the document
            self.documents[chunk_id] = {
                "content": content,
                "source_url": source_url,
                "metadata": metadata or {},
                "embedding": embedding,
                "timestamp": datetime.now().isoformat()
            }

            # Save to disk
            self._save_to_disk()

            self.logger.info(f"Stored document chunk with ID: {chunk_id}")
            return chunk_id
        except Exception as e:
            self.logger.error(f"Error storing document chunk: {str(e)}")
            raise

    def search_similar_chunks(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar document chunks based on the query using cosine similarity
        """
        try:
            # Generate embedding for the query
            query_embedding = self.generate_embedding(query)

            # Calculate similarity with all stored documents
            similarities = []
            for chunk_id, doc_data in self.documents.items():
                similarity = self._cosine_similarity(query_embedding, doc_data["embedding"])
                similarities.append((chunk_id, similarity))

            # Sort by similarity (descending)
            similarities.sort(key=lambda x: x[1], reverse=True)

            # Get top results
            top_results = similarities[:limit]

            # Format results
            results = []
            for chunk_id, similarity_score in top_results:
                if similarity_score > 0.1:  # Only return results with some similarity
                    doc_data = self.documents[chunk_id]
                    results.append({
                        "chunk_id": chunk_id,
                        "content": doc_data["content"],
                        "source_url": doc_data["source_url"],
                        "similarity_score": similarity_score,
                        "metadata": doc_data["metadata"]
                    })

            self.logger.info(f"Found {len(results)} similar chunks for query")
            return results
        except Exception as e:
            self.logger.error(f"Error searching similar chunks: {str(e)}")
            return []  # Return empty list on error

    def delete_document_chunks(self, source_url: str):
        """
        Delete all document chunks from a specific source URL
        """
        try:
            ids_to_delete = []
            for chunk_id, doc_data in self.documents.items():
                if doc_data["source_url"] == source_url:
                    ids_to_delete.append(chunk_id)

            for chunk_id in ids_to_delete:
                del self.documents[chunk_id]

            self._save_to_disk()
            self.logger.info(f"Deleted {len(ids_to_delete)} chunks for source: {source_url}")
            return len(ids_to_delete)
        except Exception as e:
            self.logger.error(f"Error deleting document chunks: {str(e)}")
            raise

    def get_all_sources(self) -> List[str]:
        """
        Get all unique source URLs in the vector store
        """
        try:
            sources = set()
            for doc_data in self.documents.values():
                source_url = doc_data.get("source_url")
                if source_url:
                    sources.add(source_url)
            return list(sources)
        except Exception as e:
            self.logger.error(f"Error getting all sources: {str(e)}")
            raise

# Create a singleton instance
_temp_instance = None

def get_vector_store():
    global _temp_instance
    if _temp_instance is None:
        _temp_instance = VectorStoreService()
    return _temp_instance
'''

    # Write the temporary vector store implementation
    with open("app/services/vector_store.py", "w") as f:
        f.write(temp_vector_store_content)

    print("✓ Created temporary in-memory vector store")
    print("✓ The RAG service can now run without Qdrant")
    print("⚠️  Note: This is a development-only solution")
    print("⚠️  For production, you should use a proper vector database like Qdrant")

    # Also update the config to have default values if API keys are missing
    update_config()

def update_config():
    """Update config to have default values for development"""
    config_content = '''import os
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
'''

    with open("app/config.py", "w") as f:
        f.write(config_content)

    print("✓ Updated configuration with development defaults")

if __name__ == "__main__":
    setup_local_qdrant()