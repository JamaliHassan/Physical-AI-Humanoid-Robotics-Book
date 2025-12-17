#!/usr/bin/env python3
"""
MDX ingestion script for the RAG Chatbot
Processes MDX files from the book and creates vector embeddings
"""

import os
import sys
import glob
import re
import asyncio
from pathlib import Path
from typing import List, Dict, Any
import logging
from dotenv import load_dotenv

# Add the app directory to the path so we can import our modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.services.vector_store import VectorStoreService
from app.config import settings

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_frontmatter(content: str) -> tuple:
    """
    Extract frontmatter from MDX content if present
    Returns (frontmatter, content_without_frontmatter)
    """
    if content.startswith('---'):
        # Find the end of frontmatter (second occurrence of '---')
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1].strip()
            content_without_frontmatter = parts[2].strip()
            return frontmatter, content_without_frontmatter

    return None, content

def clean_mdx_content(content: str) -> str:
    """
    Clean MDX content by removing imports and other non-content elements
    """
    # Remove import statements (e.g., `import ...`, `export ...`)
    content = re.sub(r'^\s*(import|export)\s+.*$', '', content, flags=re.MULTILINE)

    # Remove JSX components at the top level (simplified)
    content = re.sub(r'^\s*<.*?>.*?</.*?>\s*$', '', content, flags=re.MULTILINE)

    # Remove any remaining empty lines at the beginning
    content = content.lstrip('\n')

    return content.strip()

def chunk_by_headers(content: str) -> List[Dict[str, str]]:
    """
    Split content by headers to maintain semantic context
    """
    chunks = []

    # Split by headers (Markdown headers #, ##, ###, etc.)
    header_pattern = r'^(#+)\s+(.+)$'
    lines = content.split('\n')

    current_chunk = []
    current_header = "Introduction"
    current_header_level = 0

    for line in lines:
        match = re.match(header_pattern, line.strip())
        if match:
            # Save the previous chunk if it exists
            if current_chunk:
                chunk_text = '\n'.join(current_chunk).strip()
                if chunk_text:
                    chunks.append({
                        'header': current_header,
                        'content': chunk_text
                    })

            # Start new chunk with this header
            header_level = len(match.group(1))
            header_text = match.group(2)

            current_header = header_text
            current_header_level = header_level
            current_chunk = [line]  # Start with the header line
        else:
            current_chunk.append(line)

    # Add the last chunk
    if current_chunk:
        chunk_text = '\n'.join(current_chunk).strip()
        if chunk_text:
            chunks.append({
                'header': current_header,
                'content': chunk_text
            })

    return chunks

def process_mdx_file(file_path: str) -> List[Dict[str, Any]]:
    """
    Process a single MDX file and return document chunks
    """
    logger.info(f"Processing file: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract and remove frontmatter
    frontmatter, content = extract_frontmatter(content)

    # Clean the content
    cleaned_content = clean_mdx_content(content)

    # Chunk the content by headers
    chunks = chunk_by_headers(cleaned_content)

    # Convert file path to URL format relative to docs/
    relative_path = Path(file_path).relative_to(Path(__file__).parent.parent.parent / "docs")
    url_path = f"/docs/{relative_path.with_suffix('').as_posix()}"

    # Create document chunks with metadata
    document_chunks = []
    for i, chunk in enumerate(chunks):
        chunk_id = f"{url_path}#section-{i+1}"
        document_chunks.append({
            'content': chunk['content'],
            'source_url': url_path,
            'metadata': {
                'header': chunk['header'],
                'file_path': str(file_path),
                'chunk_index': i,
                'total_chunks': len(chunks),
                'frontmatter': frontmatter
            }
        })

    logger.info(f"Created {len(document_chunks)} chunks from {file_path}")
    return document_chunks

async def ingest_documents(docs_dir: str = None):
    """
    Main ingestion function
    """
    if docs_dir is None:
        # Default to docs directory in the project root
        docs_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'docs')

    docs_dir = os.path.abspath(docs_dir)

    if not os.path.exists(docs_dir):
        logger.error(f"Docs directory does not exist: {docs_dir}")
        return

    logger.info(f"Starting ingestion from: {docs_dir}")

    # Initialize vector store service
    vector_store = VectorStoreService()

    # Find all MDX files
    mdx_pattern = os.path.join(docs_dir, "**", "*.mdx")
    mdx_files = glob.glob(mdx_pattern, recursive=True)

    if not mdx_files:
        logger.warning(f"No MDX files found in {docs_dir}")
        return

    logger.info(f"Found {len(mdx_files)} MDX files to process")

    # Process each file
    total_chunks = 0
    for file_path in mdx_files:
        try:
            # Process the file
            document_chunks = process_mdx_file(file_path)

            # Store each chunk in the vector store
            for chunk in document_chunks:
                chunk_id = vector_store.store_document_chunk(
                    content=chunk['content'],
                    source_url=chunk['source_url'],
                    metadata=chunk['metadata']
                )
                total_chunks += 1

                logger.debug(f"Stored chunk: {chunk_id} from {chunk['source_url']}")

        except Exception as e:
            logger.error(f"Error processing file {file_path}: {str(e)}")
            continue  # Continue with other files

    logger.info(f"Ingestion completed! Processed {len(mdx_files)} files and stored {total_chunks} chunks.")

def main():
    """
    Main entry point for the ingestion script
    """
    import argparse

    parser = argparse.ArgumentParser(description="Ingest MDX files into vector store")
    parser.add_argument("--docs-dir", type=str, help="Directory containing MDX files",
                       default=os.path.join(os.path.dirname(__file__), '..', '..', 'docs'))

    args = parser.parse_args()

    # Check if required environment variables are set
    if not settings.OPENAI_API_KEY:
        logger.error("OPENAI_API_KEY environment variable is not set")
        sys.exit(1)

    if not settings.QDRANT_URL:
        logger.error("QDRANT_URL environment variable is not set")
        sys.exit(1)

    if not settings.QDRANT_API_KEY:
        logger.error("QDRANT_API_KEY environment variable is not set")
        sys.exit(1)

    # Run the ingestion
    asyncio.run(ingest_documents(args.docs_dir))

if __name__ == "__main__":
    main()