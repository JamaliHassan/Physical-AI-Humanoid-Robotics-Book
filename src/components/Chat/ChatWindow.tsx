import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, apiUrl }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Initialize session and current URL
  useEffect(() => {
    if (isOpen) {
      // Generate or retrieve session ID
      let currentSessionId = localStorage.getItem('chatbot-session-id');
      if (!currentSessionId) {
        currentSessionId = `session-${Date.now()}`;
        localStorage.setItem('chatbot-session-id', currentSessionId);
      }
      setSessionId(currentSessionId);

      // Set current page URL as context
      setCurrentUrl(window.location.pathname);
    }
  }, [isOpen]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          session_id: sessionId,
          context_url: currentUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      // Update messages with assistant response
      setMessages([...newMessages, assistantMessage]);
      setSessionId(data.session_id); // Update session ID if changed
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <h3>AI Teaching Assistant</h3>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <p>Hello! I'm your AI Teaching Assistant for the Physical AI & Humanoid Robotics Book.</p>
            <p>Ask me about ROS 2, Isaac Sim, VLA pipelines, or any other topic from the book!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${styles[message.role]}`}
            >
              <div className={styles.messageContent}>
                {message.content}
              </div>
              <div className={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className={styles.message + ' ' + styles.assistant}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the book content..."
          className={styles.textInput}
          rows={2}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;