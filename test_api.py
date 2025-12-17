"""
Simple test to verify the RAG Chatbot API is working correctly.
"""
import requests
import json

def test_api_endpoints():
    base_url = "http://localhost:8000"

    print("Testing RAG Chatbot API endpoints...")

    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")

    # Test chat endpoint
    try:
        chat_payload = {
            "message": "Hello, how are you?",
            "session_id": "test-session-123",
            "context_url": "/test-page"
        }
        response = requests.post(f"{base_url}/api/chat", json=chat_payload)
        print(f"Chat endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Chat endpoint test failed: {e}")

    # Test selection analysis endpoint
    try:
        selection_payload = {
            "text": "This is a sample text selection",
            "context_url": "/test-page",
            "session_id": "test-session-123"
        }
        response = requests.post(f"{base_url}/api/analyze-selection", json=selection_payload)
        print(f"Selection analysis endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Selection analysis endpoint test failed: {e}")

if __name__ == "__main__":
    test_api_endpoints()