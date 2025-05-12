import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, setActiveChat } from '../../features/chat/chatUsersSlice.mjs';
import { fetchMessages, sendMessage } from '../../features/chat/chatMessagesSlice.mjs';
import '../../styles/pages/admin/Chat.css'; // Reusing the admin chat styles

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chats = [], activeChat = 'announcements', unreadCounts = {}, status: chatsStatus = 'idle' } = useSelector((state) => state.chatUsers || {});
  const { messages = {}, status: messagesStatus = 'idle' } = useSelector((state) => state.chatMessages || {});
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing chats - for society we only need to get our own chat and announcements
  useEffect(() => {
    setError(null);
    dispatch(fetchChats())
      .unwrap()
      .then(() => {
        setIsInitializing(false);
      })
      .catch(error => {
        console.error('Failed to fetch chats:', error);
        setIsInitializing(false);
        setError('Failed to connect to chat server. Please try again later.');
      });
  }, [dispatch]);

  // Fetch messages for active chat whenever it changes
  useEffect(() => {
    if (activeChat) {
      setError(null);
      dispatch(fetchMessages(activeChat))
        .catch(error => {
          console.error('Failed to fetch messages:', error);
          setError('Failed to load messages. Please try again later.');
        });
    }
  }, [dispatch, activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending messages
  const handleSend = () => {
    if (!newMessage.trim()) return;
    setError(null);
    
    const messageData = {
      sender: user?.name || 'Society User',
      content: newMessage,
      isAdmin: false, // Society messages are not admin messages
      chatId: activeChat
    };
    
    console.log('Sending message:', messageData);
    
    dispatch(sendMessage(messageData))
      .unwrap()
      .then(() => {
        setNewMessage('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return '';
    }
  };

  const handleChatSelect = (chatId) => {
    dispatch(setActiveChat(chatId));
  };

  // Find our society chat
  const societyChat = Array.isArray(chats) 
    ? chats.find(chat => 
        chat?.chatType === 'society' && 
        (chat?.societyId === user?.societyId || chat?.societyEmail === user?.email)
      )
    : null;

  // Filter relevant chats for society: announcements and their own chat
  const relevantChats = Array.isArray(chats) 
    ? chats.filter(chat => 
        chat?.chatId === 'announcements' || 
        (chat?.chatType === 'society' && 
         (chat?.societyId === user?.societyId || chat?.societyEmail === user?.email))
      )
    : [];

  const getMessagePreview = (messageList) => {
    if (!messageList || messageList.length === 0) {
      return 'No messages yet';
    }
    
    const latestMessage = messageList[messageList.length - 1];
    if (!latestMessage || !latestMessage.content) {
      return 'No message content';
    }
    
    try {
      return typeof latestMessage.content === 'string' 
        ? latestMessage.content.substring(0, 30) + '...'
        : 'Invalid message content';
    } catch (error) {
      console.error('Error getting message preview:', error);
      return 'Error displaying message';
    }
  };

  const getUniqueMessageKey = (message) => {
    if (message._id) return message._id;
    if (message.chatId && message.messageId) return `${message.chatId}-${message.messageId}`;
    return Math.random().toString(36).substr(2, 9);
  };

  const currentChat = activeChat === 'announcements' 
    ? { chatId: 'announcements', chatName: 'Announcements', avatar: '📢' } 
    : societyChat || { chatName: 'Admin Chat', avatar: '👨‍💼' };

  const currentMessages = Array.isArray(messages[activeChat]) ? messages[activeChat] : [];

  return (
    <div className="chat-page">
      {isInitializing ? (
        <div className="initializing-overlay">
          <div className="loading">Connecting to chat system...</div>
        </div>
      ) : null}
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Chats</h3>
          </div>
          
          <div className="chat-list">
            {relevantChats.map(chat => chat && (
              <div 
                key={chat.chatId || 'unknown'}
                className={`chat-list-item ${activeChat === chat.chatId ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat.chatId)}
              >
                <div className={`chat-item-avatar ${chat.chatId === 'announcements' ? 'announcement-avatar' : ''}`}>
                  {chat.chatId === 'announcements' ? '📢' : '👨‍💼'}
                </div>
                <div className="chat-item-info">
                  <div className="chat-item-name">
                    {chat.chatId === 'announcements' ? 'Announcements' : 'Admin Chat'}
                  </div>
                  <div className="chat-item-preview">
                    {getMessagePreview(messages[chat.chatId])}
                  </div>
                </div>
                {unreadCounts[chat.chatId] > 0 && (
                  <div className="unread-badge">{unreadCounts[chat.chatId]}</div>
                )}
              </div>
            ))}
            
            {relevantChats.length === 0 && (
              <div className="no-societies-message">
                No chats available. Please contact an administrator.
              </div>
            )}
          </div>
        </div>
        
        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-avatar">{currentChat.avatar}</div>
            <div className="chat-info">
              <h2>{currentChat.chatName}</h2>
              <p>
                {activeChat === 'announcements' 
                  ? 'University-wide announcements' 
                  : 'Direct messages with administrators'}
              </p>
            </div>
          </div>
          
          <div className="messages-container">
            {messagesStatus === 'loading' ? (
              <div className="loading">Loading messages...</div>
            ) : currentMessages.length > 0 ? (
              <div className="messages-list">
                {currentMessages.map(message => message && (
                  <div 
                    key={getUniqueMessageKey(message)}
                    className={`message ${message.isAdmin ? 'society-message' : 'admin-message'}`}
                  >
                    <div className="message-content">
                      {message.isAdmin && (
                        <div className="message-sender">{message.sender || 'Admin'}</div>
                      )}
                      <div className="message-text">{message.content || 'No content'}</div>
                      <div className="message-time">{formatTime(message.timestamp)}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="empty-chat-message">
                <div className="empty-chat-icon">💬</div>
                <h3>No messages yet</h3>
                <p>Start the conversation by sending a message below</p>
              </div>
            )}
          </div>
          
          <div className="chat-input-container">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder={
                activeChat === 'announcements' 
                  ? 'Reply to announcements...' 
                  : 'Type a message to administrators...'
              }
              className="chat-input"
              disabled={activeChat === 'announcements' && currentMessages.length === 0}
            ></textarea>
            <button 
              className={`send-button ${newMessage.trim() ? 'active' : ''}`}
              onClick={handleSend}
              disabled={!newMessage.trim() || 
                        messagesStatus === 'sending' || 
                        (activeChat === 'announcements' && currentMessages.length === 0)}
            >
              <span className="send-icon">📨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
