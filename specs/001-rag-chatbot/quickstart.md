# Quickstart: RAG Chatbot for Physical AI & Humanoid Robotics Book

## Overview
This guide provides a quick setup and deployment process for the RAG (Retrieval-Augmented Generation) Chatbot that enhances the Physical AI & Humanoid Robotics Book with an AI Teaching Assistant.

## Prerequisites
- Python 3.11+ with pip
- Node.js 18+ with npm
- OpenAI API key
- Qdrant Cloud account and API key
- Neon Serverless Postgres account and connection string

## Backend Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Set up Backend Environment
```bash
# Create backend directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn openai qdrant-client python-dotenv sqlalchemy psycopg2-binary
```

### 3. Create Backend Structure
```bash
mkdir -p app/{routers,models,services}
touch app/{main.py,config.py}
touch app/routers/{chat.py,selection.py}
touch app/models/{chat.py,database.py}
touch app/services/{rag_service.py,vector_store.py,database.py,llm_service.py}
```

### 4. Create Environment File
Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
NEON_DSN=your_neon_connection_string
DATABASE_URL=postgresql+psycopg2://username:password@host:port/database
```

### 5. Run Backend Server
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## Frontend Integration

### 1. Navigate to Frontend
```bash
cd <project-root>
```

### 2. Create Chat Components
```bash
mkdir -p src/components/Chat
touch src/components/Chat/{ChatWidget.tsx,ChatWindow.tsx,SelectionListener.tsx,styles.module.css}
```

### 3. Build and Run Docusaurus
```bash
npm install
npm start
```

## Ingestion Setup

### 1. Prepare Book Content
Ensure your book content is in the `/docs` directory in MDX format.

### 2. Run Ingestion Script
```bash
cd backend
python scripts/ingest.py
```

This will process all MDX files in the `/docs` directory, create vector embeddings, and store them in Qdrant.

## API Endpoints

### Chat Endpoint
- **POST** `/chat` - General Q&A with the AI assistant
- Request body: `{"message": "your question", "session_id": "optional session id", "context_url": "optional page url"}`
- Response: AI-generated answer with sources

### Selection Analysis Endpoint
- **POST** `/analyze-selection` - Analyze selected text with context
- Request body: `{"text": "selected text", "context_url": "page url", "session_id": "optional session id"}`
- Response: Explanation of the selected text

## Testing

### 1. Unit Tests
```bash
cd backend
python -m pytest tests/
```

### 2. Manual Testing
1. Start the backend server
2. Start the Docusaurus frontend
3. Navigate to any book page
4. Use the floating chat widget to ask questions
5. Select text and use the "Ask AI" button to test the selection feature

## Deployment

### Backend
Deploy the FastAPI application to any Python-compatible hosting service (Heroku, AWS, etc.).

### Frontend
The Docusaurus site can be deployed to GitHub Pages using the existing workflow.

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure the backend allows requests from your frontend domain
2. **API key issues**: Verify all environment variables are correctly set
3. **Vector search not working**: Check that the ingestion script completed successfully

### Performance
- Response times should be under 3 seconds for most queries
- If experiencing slow responses, check your OpenAI and Qdrant API limits