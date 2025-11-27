import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { messageService, guideService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const MessagesPage = () => {
  const { currentUser, userProfile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
      
      // Check if coming from "Contact Guide" (or "Message Traveler") button
      const chatInfo = sessionStorage.getItem('chatWithGuide');
      if (chatInfo) {
        const { guideId, guideName } = JSON.parse(chatInfo);
        startConversationWithUser(guideId, guideName);
        sessionStorage.removeItem('chatWithGuide');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.conversationId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const convos = await messageService.getUserConversations(currentUser.uid);
      
      const convosWithDetails = await Promise.all(
        convos.map(async (convo) => {
          const otherUserId = convo.participants.find(id => id !== currentUser.uid);
          try {
            // Try to get guide profile, if not found (it's a traveler), create basic object
            let otherUser = await guideService.getGuideProfile(otherUserId);
            
            if (!otherUser) {
              // Ideally you'd fetch traveler profile, but for now fallback
              otherUser = { 
                guideId: otherUserId, 
                userId: otherUserId, // Add this for clarity
                fullName: 'User', // If you have a userService, use it here
                profileImageUrl: null 
              };
            }
            
            return { ...convo, otherUser };
          } catch (error) {
            return { ...convo, otherUser: { fullName: 'User', profileImageUrl: null } };
          }
        })
      );
      
      setConversations(convosWithDetails);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
    setLoading(false);
  };

  const startConversationWithUser = async (otherUserId, otherUserName) => {
    try {
      const conversationId = await messageService.getOrCreateConversation(
        currentUser.uid,
        otherUserId
      );
      
      // Try fetching guide profile, or fallback for traveler
      const guide = await guideService.getGuideProfile(otherUserId);
      
      setSelectedConversation({
        conversationId,
        otherUser: guide || { userId: otherUserId, fullName: otherUserName, profileImageUrl: null },
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          messageId: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const otherUserId = selectedConversation.otherUser.guideId || selectedConversation.otherUser.userId;
      
      await messageService.sendMessage(
        selectedConversation.conversationId,
        currentUser.uid,
        otherUserId,
        newMessage.trim()
      );

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
    setSending(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    else if (diffInHours < 48) return 'Yesterday';
    else return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!currentUser) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <h2>Please Login</h2>
          <p>You need to be logged in to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.messagesContainer}>
          {/* Conversations List */}
          <div style={styles.conversationsList}>
            <div style={styles.conversationsHeader}>
              <h2 style={styles.conversationsTitle}>Messages</h2>
            </div>

            {loading ? (
              <div style={styles.loadingState}>
                <div style={styles.loader}>Loading conversations...</div>
              </div>
            ) : conversations.length === 0 ? (
              <div style={styles.emptyConversations}>
                <div style={styles.emptyIcon}>💬</div>
                <p style={styles.emptyText}>No conversations yet</p>
                <p style={styles.emptySubtext}>
                  Start a conversation from a booking or tour page
                </p>
              </div>
            ) : (
              <div style={styles.conversationsContent}>
                {conversations.map((convo) => (
                  <div
                    key={convo.conversationId}
                    style={{
                      ...styles.conversationItem,
                      ...(selectedConversation?.conversationId === convo.conversationId
                        ? styles.conversationItemActive
                        : {}),
                    }}
                    onClick={() => setSelectedConversation(convo)}
                  >
                    <div style={styles.conversationAvatar}>
                      {convo.otherUser.profileImageUrl ? (
                        <img
                          src={convo.otherUser.profileImageUrl}
                          alt={convo.otherUser.fullName}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <div style={styles.avatarPlaceholder}>
                          {convo.otherUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div style={styles.conversationInfo}>
                      <div style={styles.conversationName}>
                        {convo.otherUser.fullName || 'User'}
                      </div>
                      <div style={styles.conversationLastMessage}>
                        {convo.lastMessage || 'No messages yet'}
                      </div>
                    </div>
                    {convo.lastMessageTime && (
                      <div style={styles.conversationTime}>
                        {formatTime(convo.lastMessageTime)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div style={styles.messagesArea}>
            {selectedConversation ? (
              <>
                {/* NEW: Safety Disclaimer Banner */}
                <div style={styles.safetyBanner}>
                    <span style={{fontSize:'18px', marginRight:'8px'}}>🛡️</span>
                    <span>
                        <strong>Safety Notice:</strong> Do not share financial details or passwords. 
                        Payments outside Travor are not protected and violate our terms.
                    </span>
                </div>

                {/* Chat Header */}
                <div style={styles.chatHeader}>
                  <div style={styles.chatHeaderInfo}>
                    <div style={styles.chatAvatar}>
                      {selectedConversation.otherUser.profileImageUrl ? (
                        <img
                          src={selectedConversation.otherUser.profileImageUrl}
                          alt={selectedConversation.otherUser.fullName}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <div style={styles.avatarPlaceholder}>
                          {selectedConversation.otherUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={styles.chatHeaderName}>
                        {selectedConversation.otherUser.fullName || 'User'}
                      </div>
                      <div style={styles.chatHeaderStatus}>
                        {userProfile?.role === 'guide' ? 'Traveler' : 'Guide'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={styles.messagesContent}>
                  {messages.length === 0 ? (
                    <div style={styles.emptyMessages}>
                      <div style={styles.emptyIcon}>💬</div>
                      <p style={styles.emptyText}>No messages yet</p>
                      <p style={styles.emptySubtext}>Start the conversation!</p>
                    </div>
                  ) : (
                    <div style={styles.messagesList}>
                      {messages.map((message) => {
                        const isOwn = message.senderId === currentUser.uid;
                        return (
                          <div
                            key={message.messageId}
                            style={{
                              ...styles.messageItem,
                              ...(isOwn ? styles.messageItemOwn : styles.messageItemOther),
                            }}
                          >
                            <div
                              style={{
                                ...styles.messageBubble,
                                ...(isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther),
                              }}
                            >
                              <div style={styles.messageText}>{message.content}</div>
                              <div style={styles.messageTime}>
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} style={styles.messageInput}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={styles.input}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    style={styles.sendButton}
                    disabled={sending || !newMessage.trim()}
                  >
                    {sending ? '...' : '📤'}
                  </button>
                </form>
              </>
            ) : (
              <div style={styles.noConversationSelected}>
                <div style={styles.emptyIcon}>💬</div>
                <h3 style={styles.emptyTitle}>Select a conversation</h3>
                <p style={styles.emptyText}>
                  Choose a conversation from the list to start messaging
                </p>
              </div>
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
    paddingTop: '80px',
    paddingBottom: '20px',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
  },
  messagesContainer: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '24px',
    height: 'calc(100vh - 120px)',
    background: 'white',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  conversationsList: {
    borderRight: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
  },
  conversationsHeader: {
    padding: '24px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  conversationsTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: 0,
  },
  conversationsContent: {
    flex: 1,
    overflowY: 'auto',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    cursor: 'pointer',
    transition: 'background 0.3s',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  conversationItemActive: {
    background: COLORS.light,
    borderLeft: `4px solid ${COLORS.primary}`,
  },
  conversationAvatar: {
    flexShrink: 0,
  },
  avatarImage: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
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
    minWidth: 0,
  },
  conversationName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  conversationLastMessage: {
    fontSize: '14px',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  conversationTime: {
    fontSize: '12px',
    color: '#999',
    flexShrink: 0,
  },
  messagesArea: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  // NEW: Safety Banner Style
  safetyBanner: {
      background: '#fff3cd',
      color: '#856404',
      padding: '12px 20px',
      fontSize: '13px',
      borderBottom: '1px solid #ffeeba',
      display: 'flex',
      alignItems: 'center'
  },
  chatHeader: {
    padding: '20px 24px',
    borderBottom: `1px solid ${COLORS.border}`,
    background: 'white',
  },
  chatHeaderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chatAvatar: {
    flexShrink: 0,
  },
  chatHeaderName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  chatHeaderStatus: {
    fontSize: '14px',
    color: '#666',
  },
  messagesContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    background: COLORS.light,
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  messageItem: {
    display: 'flex',
  },
  messageItemOwn: {
    justifyContent: 'flex-end',
  },
  messageItemOther: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
  },
  messageBubbleOwn: {
    background: COLORS.primary,
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  messageBubbleOther: {
    background: 'white',
    color: '#1a1a2e',
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '4px',
  },
  messageTime: {
    fontSize: '11px',
    opacity: 0.7,
    textAlign: 'right',
  },
  messageInput: {
    display: 'flex',
    gap: '12px',
    padding: '20px 24px',
    borderTop: `1px solid ${COLORS.border}`,
    background: 'white',
  },
  input: {
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
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  emptyConversations: {
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyMessages: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  noConversationSelected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '40px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '4px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#999',
  },
  loadingState: {
    padding: '40px 20px',
    textAlign: 'center',
  },
  loader: {
    fontSize: '16px',
    color: '#666',
  },
  errorState: {
    textAlign: 'center',
    padding: '100px 20px',
  },
};

export default MessagesPage;