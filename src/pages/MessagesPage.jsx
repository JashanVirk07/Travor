// src/pages/MessagesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { messageService, guideService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const MessagesPage = () => {
  const { currentUser, userProfile, setCurrentPage } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setCurrentPage('login');
      return;
    }

    // Check if coming from "Contact Guide" button
    const chatWithGuide = sessionStorage.getItem('chatWithGuide');
    if (chatWithGuide) {
      const guideInfo = JSON.parse(chatWithGuide);
      startConversationWithGuide(guideInfo);
      sessionStorage.removeItem('chatWithGuide');
    }

    loadConversations();
  }, [currentUser]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.conversationId);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const convos = await messageService.getUserConversations(currentUser.uid);
      
      // Enrich conversations with other participant info
      const enrichedConvos = await Promise.all(
        convos.map(async (convo) => {
          const otherUserId = convo.participants.find(id => id !== currentUser.uid);
          if (otherUserId) {
            const otherUserProfile = await guideService.getGuideProfile(otherUserId);
            return {
              ...convo,
              otherUser: otherUserProfile || { fullName: 'User', guideId: otherUserId }
            };
          }
          return convo;
        })
      );

      setConversations(enrichedConvos);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
    setLoading(false);
  };

  const startConversationWithGuide = async (guideInfo) => {
    try {
      const conversationId = await messageService.getOrCreateConversation(
        currentUser.uid,
        guideInfo.guideId
      );

      // Load guide profile
      const guideProfile = await guideService.getGuideProfile(guideInfo.guideId);

      setSelectedConversation({
        conversationId,
        otherUser: guideProfile || { fullName: guideInfo.guideName, guideId: guideInfo.guideId }
      });

      loadConversations();
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      // Set up real-time listener for messages
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          messageId: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        setMessages(msgs);
        
        // Scroll to bottom
        setTimeout(() => {
          const messagesContainer = document.getElementById('messages-container');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 100);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      await messageService.sendMessage(
        selectedConversation.conversationId,
        currentUser.uid,
        selectedConversation.otherUser.guideId || selectedConversation.otherUser.userId,
        newMessage.trim()
      );

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
    setSending(false);
  };

  const handleSelectConversation = (convo) => {
    setSelectedConversation(convo);
    setMessages([]);
  };

  if (!currentUser) {
    return (
      <div style={styles.loadingContainer}>
        <p>Please login to access messages</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Messages</h1>
        </div>

        <div style={styles.messagesLayout}>
          {/* Conversations List */}
          <div style={styles.conversationsList}>
            <h2 style={styles.conversationsTitle}>Conversations</h2>
            {loading ? (
              <p style={styles.loadingText}>Loading...</p>
            ) : conversations.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No conversations yet</p>
                <button 
                  onClick={() => setCurrentPage('guides')}
                  style={styles.browseButton}
                >
                  Find Guides
                </button>
              </div>
            ) : (
              <div style={styles.conversationItems}>
                {conversations.map((convo) => (
                  <div
                    key={convo.conversationId}
                    onClick={() => handleSelectConversation(convo)}
                    style={{
                      ...styles.conversationItem,
                      ...(selectedConversation?.conversationId === convo.conversationId 
                        ? styles.conversationItemActive 
                        : {})
                    }}
                  >
                    <div style={styles.conversationAvatar}>
                      {convo.otherUser?.profileImageUrl ? (
                        <img 
                          src={convo.otherUser.profileImageUrl} 
                          alt={convo.otherUser.fullName}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <div style={styles.avatarPlaceholder}>
                          {convo.otherUser?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div style={styles.conversationInfo}>
                      <div style={styles.conversationName}>
                        {convo.otherUser?.fullName || 'User'}
                      </div>
                      <div style={styles.conversationLastMessage}>
                        {convo.lastMessage || 'No messages yet'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div style={styles.messagesArea}>
            {!selectedConversation ? (
              <div style={styles.noConversationSelected}>
                <div style={styles.noConversationIcon}>💬</div>
                <p style={styles.noConversationText}>Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={styles.chatHeader}>
                  <div style={styles.chatHeaderInfo}>
                    <div style={styles.chatAvatar}>
                      {selectedConversation.otherUser?.profileImageUrl ? (
                        <img 
                          src={selectedConversation.otherUser.profileImageUrl} 
                          alt={selectedConversation.otherUser.fullName}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <div style={styles.avatarPlaceholder}>
                          {selectedConversation.otherUser?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={styles.chatHeaderName}>
                        {selectedConversation.otherUser?.fullName || 'User'}
                      </div>
                      <div style={styles.chatHeaderStatus}>
                        {selectedConversation.otherUser?.location || 'Guide'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('selectedGuideId', selectedConversation.otherUser.guideId);
                      setCurrentPage('guide-profile');
                    }}
                    style={styles.viewProfileBtn}
                  >
                    View Profile
                  </button>
                </div>

                {/* Messages Container */}
                <div id="messages-container" style={styles.messagesContainer}>
                  {messages.length === 0 ? (
                    <div style={styles.noMessages}>
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.messageId}
                        style={{
                          ...styles.messageWrapper,
                          justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageBubble,
                            ...(message.senderId === currentUser.uid 
                              ? styles.messageBubbleSent 
                              : styles.messageBubbleReceived)
                          }}
                        >
                          <div style={styles.messageContent}>{message.content}</div>
                          <div style={styles.messageTime}>
                            {message.timestamp?.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} style={styles.messageForm}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={styles.messageInput}
                    disabled={sending}
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim() || sending}
                    style={{
                      ...styles.sendButton,
                      ...((!newMessage.trim() || sending) ? styles.sendButtonDisabled : {})
                    }}
                  >
                    {sending ? '...' : '📤 Send'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: COLORS.light,
    padding: '40px 0',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
  },
  messagesLayout: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '24px',
    height: 'calc(100vh - 200px)',
  },
  conversationsList: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  conversationsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  conversationItems: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '2px solid transparent',
  },
  conversationItemActive: {
    background: COLORS.light,
    border: `2px solid ${COLORS.primary}`,
  },
  conversationAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    background: COLORS.primary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  conversationName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  conversationLastMessage: {
    fontSize: '14px',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  messagesArea: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  noConversationSelected: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  },
  noConversationIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  noConversationText: {
    fontSize: '16px',
  },
  chatHeader: {
    padding: '20px 24px',
    borderBottom: `2px solid ${COLORS.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatHeaderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chatAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  chatHeaderName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  chatHeaderStatus: {
    fontSize: '14px',
    color: '#666',
  },
  viewProfileBtn: {
    padding: '8px 16px',
    background: 'transparent',
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.primary,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  messagesContainer: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  noMessages: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '8px',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
    wordWrap: 'break-word',
  },
  messageBubbleSent: {
    background: COLORS.primary,
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  messageBubbleReceived: {
    background: COLORS.light,
    color: '#333',
    borderBottomLeftRadius: '4px',
  },
  messageContent: {
    fontSize: '15px',
    lineHeight: '1.4',
    marginBottom: '4px',
  },
  messageTime: {
    fontSize: '11px',
    opacity: 0.7,
  },
  messageForm: {
    padding: '20px 24px',
    borderTop: `2px solid ${COLORS.border}`,
    display: 'flex',
    gap: '12px',
  },
  messageInput: {
    flex: 1,
    padding: '12px 16px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '24px',
    fontSize: '15px',
    outline: 'none',
  },
  sendButton: {
    padding: '12px 24px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  sendButtonDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  },
  browseButton: {
    padding: '10px 20px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loadingText: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
};

export default MessagesPage;