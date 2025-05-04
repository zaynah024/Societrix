import { useState, useEffect, useRef } from 'react';
import '../../styles/pages/admin/Chat.css';

const Chat = () => {
  const [activeChat, setActiveChat] = useState('announcements');
  const [societies, setSocieties] = useState([]);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Simulate API call
        
        // Mock data - societies
        const mockSocieties = [
          { id: 1, name: 'Computer Science Society', avatar: '💻' },
          { id: 2, name: 'Drama Club', avatar: '🎭' },
          { id: 3, name: 'Physics Society', avatar: '⚛️' },
          { id: 4, name: 'Debate Club', avatar: '🎙️' },
          { id: 5, name: 'Art Society', avatar: '🎨' }
        ];
        
        // Mock data - messages
        const mockMessages = {
          announcements: [
            {
              id: 1,
              sender: 'admin',
              content: 'Welcome to the new academic year! All societies should submit their annual plans by the end of next week.',
              timestamp: '2023-07-01T10:30:00.000Z',
              isAdmin: true
            },
            {
              id: 2,
              sender: 'Computer Science Society',
              content: 'Thank you for the reminder. Our plan will be submitted by Wednesday.',
              timestamp: '2023-07-01T11:05:00.000Z',
              isAdmin: false
            },
            {
              id: 3,
              sender: 'admin',
              content: 'The university budget for society events this semester has been increased by 15%. Please update your proposals accordingly.',
              timestamp: '2023-07-03T09:15:00.000Z',
              isAdmin: true
            },
            {
              id: 4,
              sender: 'Drama Club',
              content: 'That\'s great news! We\'ll revise our production budget.',
              timestamp: '2023-07-03T09:30:00.000Z',
              isAdmin: false
            }
          ]
        };
        
        // Initialize chat entries for all societies
        mockSocieties.forEach(society => {
          const chatId = `society-${society.id}`;
          if (!mockMessages[chatId]) {
            mockMessages[chatId] = [];
          }
        });
        
        // Add mock messages for Computer Science Society
        mockMessages['society-1'] = [
          {
            id: 1,
            sender: 'admin',
            content: 'Hello Computer Science Society, how can I help you today?',
            timestamp: '2023-07-01T09:00:00.000Z',
            isAdmin: true
          },
          {
            id: 2,
            sender: 'Computer Science Society',
            content: 'We were wondering about the process for booking the main auditorium for our upcoming event.',
            timestamp: '2023-07-01T09:15:00.000Z',
            isAdmin: false
          },
          {
            id: 3,
            sender: 'admin',
            content: 'You\'ll need to submit a venue request through the Calendar page. Please include the date, time, and expected attendee count.',
            timestamp: '2023-07-01T09:20:00.000Z',
            isAdmin: true
          },
          {
            id: 4,
            sender: 'Computer Science Society',
            content: 'Perfect, thanks for the information. We\'ll submit that request this week.',
            timestamp: '2023-07-01T09:25:00.000Z',
            isAdmin: false
          },
          {
            id: 5,
            sender: 'admin',
            content: 'Great! Let me know if you need anything else.',
            timestamp: '2023-07-01T09:28:00.000Z',
            isAdmin: true
          }
        ];
        
        // Add mock messages for Drama Club
        mockMessages['society-2'] = [
          {
            id: 1,
            sender: 'admin',
            content: 'Hi Drama Club, what can I assist you with?',
            timestamp: '2023-07-02T10:00:00.000Z',
            isAdmin: true
          },
          {
            id: 2,
            sender: 'Drama Club',
            content: 'We need information about the budget allocation for our upcoming production.',
            timestamp: '2023-07-02T10:15:00.000Z',
            isAdmin: false
          },
          {
            id: 3,
            sender: 'admin',
            content: 'Your society has been allocated $1,500 for this semester. Would you like me to send over the detailed breakdown?',
            timestamp: '2023-07-02T10:20:00.000Z',
            isAdmin: true
          },
          {
            id: 4,
            sender: 'Drama Club',
            content: 'Yes, that would be very helpful. Could you also include information about additional funding sources?',
            timestamp: '2023-07-02T10:25:00.000Z',
            isAdmin: false
          }
        ];

        // Add mock messages for Physics Society
        mockMessages['society-3'] = [
          {
            id: 1,
            sender: 'Physics Society',
            content: 'Hello Admin, we\'d like to organize a stargazing event next month.',
            timestamp: '2023-07-04T14:10:00.000Z',
            isAdmin: false
          },
          {
            id: 2,
            sender: 'admin',
            content: 'That sounds like a great idea! Do you have a specific date and location in mind?',
            timestamp: '2023-07-04T14:15:00.000Z',
            isAdmin: true
          },
          {
            id: 3,
            sender: 'Physics Society',
            content: 'We\'re thinking about the university observatory on the 15th next month.',
            timestamp: '2023-07-04T14:20:00.000Z',
            isAdmin: false
          }
        ];
        
        // Mock unread counts
        const mockUnreadCounts = {
          'society-2': 2,
          'society-4': 1
        };
        
        setSocieties(mockSocieties);
        setMessages(mockMessages);
        setUnreadCounts(mockUnreadCounts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching chat data:', error);
        setIsLoading(false);
      }
    };

    fetchChatData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const currentMessages = messages[activeChat] || [];
    
    // Add the new message
    const updatedMessages = [
      ...currentMessages,
      {
        id: currentMessages.length + 1,
        sender: 'admin',
        content: newMessage,
        timestamp: new Date().toISOString(),
        isAdmin: true
      }
    ];
    
    // Update messages
    setMessages({
      ...messages,
      [activeChat]: updatedMessages
    });
    
    // Clear input
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    
    // Clear unread count for this chat
    if (unreadCounts[chatId]) {
      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: 0
      }));
    }
  };

  // Helper to get the society name from the active chat
  const getActiveSocietyName = () => {
    if (activeChat === 'announcements') {
      return 'Announcements';
    }
    
    const societyId = parseInt(activeChat.split('-')[1]);
    const society = societies.find(s => s.id === societyId);
    return society ? society.name : '';
  };

  // Helper to get the society avatar from the active chat
  const getActiveSocietyAvatar = () => {
    if (activeChat === 'announcements') {
      return '📢';
    }
    
    const societyId = parseInt(activeChat.split('-')[1]);
    const society = societies.find(s => s.id === societyId);
    return society ? society.avatar : '';
  };

  if (isLoading) {
    return <div className="loading">Loading chat data...</div>;
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Chat sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Chats</h3>
          </div>
          
          <div className="chat-list">
            {/* Global announcements chat */}
            <div 
              className={`chat-list-item ${activeChat === 'announcements' ? 'active' : ''}`}
              onClick={() => handleChatSelect('announcements')}
            >
              <div className="chat-item-avatar announcement-avatar">📢</div>
              <div className="chat-item-info">
                <div className="chat-item-name">Announcements</div>
                <div className="chat-item-preview">
                  {messages.announcements && messages.announcements.length > 0 ? 
                    messages.announcements[messages.announcements.length - 1].content.substring(0, 30) + '...' : 
                    'No messages yet'}
                </div>
              </div>
              {unreadCounts['announcements'] > 0 && (
                <div className="unread-badge">{unreadCounts['announcements']}</div>
              )}
            </div>
            
            <div className="chat-list-separator">
              <span>Societies</span>
            </div>
            
            {/* Individual society chats */}
            {societies.map(society => (
              <div 
                key={society.id}
                className={`chat-list-item ${activeChat === `society-${society.id}` ? 'active' : ''}`}
                onClick={() => handleChatSelect(`society-${society.id}`)}
              >
                <div className="chat-item-avatar">{society.avatar}</div>
                <div className="chat-item-info">
                  <div className="chat-item-name">{society.name}</div>
                  <div className="chat-item-preview">
                    {messages[`society-${society.id}`] && messages[`society-${society.id}`].length > 0 ? 
                      messages[`society-${society.id}`][messages[`society-${society.id}`].length - 1].content.substring(0, 30) + '...' : 
                      'No messages yet'}
                  </div>
                </div>
                {unreadCounts[`society-${society.id}`] > 0 && (
                  <div className="unread-badge">{unreadCounts[`society-${society.id}`]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="chat-main">
          {/* Chat header */}
          <div className="chat-header">
            <div className="chat-avatar">{getActiveSocietyAvatar()}</div>
            <div className="chat-info">
              <h2>{getActiveSocietyName()}</h2>
              <p>{activeChat === 'announcements' ? 'Announcements for all societies' : 'Direct messages'}</p>
            </div>
          </div>
          
          {/* Messages container - fixed size */}
          <div className="messages-container">
            {messages[activeChat] && messages[activeChat].length > 0 ? (
              <div className="messages-list">
                {messages[activeChat].map(message => (
                  <div 
                    key={message.id}
                    className={`message ${message.isAdmin ? 'admin-message' : 'society-message'}`}
                  >
                    <div className="message-content">
                      {!message.isAdmin && (
                        <div className="message-sender">{message.sender}</div>
                      )}
                      <div className="message-text">{message.content}</div>
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
          
          {/* Message input */}
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
            ></textarea>
            <button 
              className={`send-button ${newMessage.trim() ? 'active' : ''}`}
              onClick={handleSend}
              disabled={!newMessage.trim()}
            >
              <span className="send-icon">📨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
