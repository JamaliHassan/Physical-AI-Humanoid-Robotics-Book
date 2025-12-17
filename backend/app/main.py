from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import chat, selection

app = FastAPI(title="RAG Chatbot API", version="1.0.0")

# CORS middleware - allow requests from Docusaurus development server and GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-username.github.io"],  # Docusaurus dev server and GitHub Pages
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(selection.router, prefix="/api", tags=["selection"])

@app.get("/")
def read_root():
    return {"message": "RAG Chatbot API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}