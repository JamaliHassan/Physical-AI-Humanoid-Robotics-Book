import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import styles from './styles.module.css';

interface ChatWidgetProps {
  apiUrl?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ apiUrl =
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://your-backend-domain.com') // Replace with actual backend URL in production
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Handle unread messages indicator
  useEffect(() => {
    if (isChatOpen) {
      setHasUnread(false);
    }
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className={styles.chatWidget}>
      {isChatOpen ? (
        <ChatWindow
          isOpen={isChatOpen}
          onClose={closeChat}
          apiUrl={apiUrl}
        />
      ) : (
        <button
          className={`${styles.floatingButton} ${hasUnread ? styles.unread : ''}`}
          onClick={toggleChat}
        >
          <div className={styles.buttonContent}>
            <span className={styles.icon}>🤖</span>
            {hasUnread && <span className={styles.unreadIndicator}></span>}
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;