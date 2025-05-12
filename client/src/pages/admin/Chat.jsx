import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, setActiveChat, createChat } from '../../features/chat/chatUsersSlice.mjs';
import { fetchMessages, sendMessage } from '../../features/chat/chatMessagesSlice.mjs';
import { fetchSocieties } from '../../features/society/societySlice.mjs';
import axios from 'axios';
import '../../styles/pages/admin/Chat.css';

const Chat = () => {
  const dispatch = useDispatch();
  const { chats = [], activeChat = 'announcements', unreadCounts = {}, status: chatsStatus = 'idle' } = useSelector((state) => state.chatUsers || {});
  const { messages = {}, status: messagesStatus = 'idle' } = useSelector((state) => state.chatMessages || {});
  const { societies = [] } = useSelector((state) => state.society || {});
  const { role } = useSelector((state) => state.authenticator || {}); // Fetch user role
  const { darkMode } = useSelector((state) => state.theme || {}); // Fetch dark mode state
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [lastSocietyUpdate, setLastSocietyUpdate] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch all societies from the database
  useEffect(() => {
    dispatch(fetchSocieties())
      .unwrap()
      .then((fetchedSocieties) => {
        console.log('Societies fetched:', fetchedSocieties);
        setLastSocietyUpdate(Date.now());
      })
      .catch(error => console.error('Failed to fetch societies:', error));
  }, [dispatch]);

  // Fetch existing chats
  useEffect(() => {
    dispatch(fetchChats())
      .unwrap()
      .then((fetchedChats) => {
        console.log('Chats fetched:', fetchedChats);
        ensureAllSocietiesHaveChats();
      })
      .catch(error => console.error('Failed to fetch chats:', error));
  }, [dispatch, lastSocietyUpdate]);

  // Function to create chats for societies that don't have them
  const ensureAllSocietiesHaveChats = async () => {
    try {
      if (!Array.isArray(societies) || societies.length === 0) {
        console.log('No societies available yet');
        setIsInitializing(false);
        return;
      }
      
      console.log('Checking if all societies have chats...');
      
      try {
        // Call our API endpoint to ensure all society chats exist
        const response = await axios.post('http://localhost:5000/api/ensure-society-chats', {
          societies: societies.map(society => ({
            _id: society._id,
            name: society.name
          }))
        });
        
        console.log('Society chats ensured:', response.data);
        
        // Refresh the chats list
        dispatch(fetchChats());
        
      } catch (error) {
        console.error('Error ensuring society chats:', error);
      } finally {
        setIsInitializing(false);
      }
    } catch (error) {
      console.error('Error in ensureAllSocietiesHaveChats:', error);
      setIsInitializing(false);
    }
  };

  // Helper function to generate avatar for society based on name
  function getAvatarForSociety(societyName) {
    const societyType = societyName.toLowerCase();
    
    if (societyType.includes('computer') || societyType.includes('tech') || societyType.includes('programming')) {
      return '💻';
    } else if (societyType.includes('drama') || societyType.includes('theatre') || societyType.includes('acting')) {
      return '🎭';
    } else if (societyType.includes('music') || societyType.includes('band') || societyType.includes('choir')) {
      return '🎵';
    } else if (societyType.includes('science') || societyType.includes('physics')) {
      return '⚛️';
    } else if (societyType.includes('art') || societyType.includes('paint')) {
      return '🎨';
    } else if (societyType.includes('sport') || societyType.includes('athletic')) {
      return '🏆';
    } else if (societyType.includes('debate') || societyType.includes('speech')) {
      return '🎙️';
    } else if (societyType.includes('book') || societyType.includes('literature') || societyType.includes('reading')) {
      return '📚';
    } else if (societyType.includes('math') || societyType.includes('mathematics')) {
      return '🔢';
    } else if (societyType.includes('game') || societyType.includes('gaming')) {
      return '🎮';
    }
    
    // Default emoji
    return '🏛️';
  }

  // Fetch messages for active chat whenever it changes
  useEffect(() => {
    if (activeChat) {
      dispatch(fetchMessages(activeChat));
    }
  }, [dispatch, activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending messages with better error handling
  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      sender: 'admin',
      content: newMessage,
      isAdmin: true,
      chatId: activeChat
    };
    
    console.log('Sending message:', messageData);
    
    dispatch(sendMessage(messageData))
      .unwrap()
      .then(response => {
        console.log('Message sent successfully:', response);
        setNewMessage('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
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

  const getActiveSocietyName = () => {
    if (activeChat === 'announcements') {
      return 'Announcements';
    }
    
    const society = Array.isArray(chats) ? chats.find(chat => chat?.chatId === activeChat) : null;
    return society ? society.chatName : '';
  };

  const getActiveSocietyAvatar = () => {
    if (activeChat === 'announcements') {
      return '📢';
    }
    
    const society = Array.isArray(chats) ? chats.find(chat => chat?.chatId === activeChat) : null;
    return society ? society.avatar : '💬';
  };

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
    // Ensure we have a truly unique key for each message
    if (message._id) return message._id;
    if (message.chatId && message.messageId) return `${message.chatId}-${message.messageId}`;
    return Math.random().toString(36).substr(2, 9); // Fallback to random string
  };

  const isLoading = chatsStatus === 'loading' || messagesStatus === 'loading';

  // Filter chats based on user role
  const filteredChats = role === 'society' 
    ? chats.filter(chat => chat.chatId === 'announcements' || chat.chatType === 'admin') 
    : chats;

  const currentMessages = Array.isArray(messages[activeChat]) ? messages[activeChat] : [];

  const societyChats = Array.isArray(filteredChats) ? 
    filteredChats.filter(chat => chat && chat.chatType === 'society') : 
    [];

  return (
    <div className="chat-page">
      {isInitializing ? (
        <div className="initializing-overlay">
          <div className="loading">Setting up chat system...</div>
        </div>
      ) : null}
      
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Chats</h3>
          </div>
          
          <div className="chat-list">
            <div 
              className={`chat-list-item ${activeChat === 'announcements' ? 'active' : ''}`}
              onClick={() => handleChatSelect('announcements')}
            >
              <div className="chat-item-avatar announcement-avatar">📢</div>
              <div className="chat-item-info">
                <div className="chat-item-name">Announcements</div>
                <div className="chat-item-preview">
                  {getMessagePreview(messages['announcements'])}
                </div>
              </div>
              {unreadCounts['announcements'] > 0 && (
                <div className="unread-badge">{unreadCounts['announcements']}</div>
              )}
            </div>

            {role !== 'society' && (
              <>
                <div className="chat-list-separator">
                  <span>Societies ({societyChats.length})</span>
                </div>
                
                {societyChats.length > 0 ? (
                  societyChats.map(society => society && (
                    <div 
                      key={society.chatId || 'unknown'}
                      className={`chat-list-item ${activeChat === society.chatId ? 'active' : ''}`}
                      onClick={() => handleChatSelect(society.chatId)}
                    >
                      <div className="chat-item-avatar">{society.avatar || '💬'}</div>
                      <div className="chat-item-info">
                        <div className="chat-item-name">{society.chatName || 'Unknown Society'}</div>
                        <div className="chat-item-preview">
                          {getMessagePreview(messages[society.chatId])}
                        </div>
                      </div>
                      {unreadCounts[society.chatId] > 0 && (
                        <div className="unread-badge">{unreadCounts[society.chatId]}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-societies-message">
                    No societies available. Add societies from the Add Society page.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-avatar">{getActiveSocietyAvatar()}</div>
            <div className="chat-info">
              <h2>{getActiveSocietyName()}</h2>
              <p>{activeChat === 'announcements' ? 'Announcements for all societies' : 'Direct messages'}</p>
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
                    className={`message ${message.isAdmin ? 'admin-message' : 'society-message'}`}
                    style={{
                      color: message.isAdmin
                        ? role === 'admin' ? 'white' : 'blue'
                        : role === 'society' ? 'white' : 'blue'
                    }}
                  >
                    <div className="message-content">
                      {!message.isAdmin && (
                        <div className="message-sender">{message.sender || 'Unknown'}</div>
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
                  ? 'Type an announcement for all societies...' 
                  : `Type a message to ${getActiveSocietyName()}...`
              }
              className="chat-input"
              style={{
                color: darkMode ? 'white' : 'black',
                backgroundColor: darkMode ? '#333' : '#fff'
              }}
            ></textarea>
            <button 
              className={`send-button ${newMessage.trim() ? 'active' : ''}`}
              onClick={handleSend}
              disabled={!newMessage.trim() || messagesStatus === 'sending'}
            ></button>
            <button>
              <span className="send-icon">📨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
