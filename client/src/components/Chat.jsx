import React from "react";
import { useState, useEffect, useRef } from 'react';
import '../styles/Chat.css';

const Chat = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('admin');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  // Mock message data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate initial messages based on the active tab
    if (activeTab === 'admin') {
      setMessages([
        {
          id: 1,
          sender: 'Admin',
          content: 'Hello! How can I help you today?',
          timestamp: new Date(Date.now() - 60000),
          isAdmin: true
        }
      ]);
    } else {
      setMessages([
        {
          id: 1,
          sender: 'Tech Support',
          content: 'Welcome to tech support. What issue are you experiencing?',
          timestamp: new Date(Date.now() - 120000),
          isAdmin: true
        }
      ]);
    }
  }, [activeTab]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'You',
      content: inputValue,
      timestamp: new Date(),
      isAdmin: false
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    
    // Simulate admin response after a short delay
    setTimeout(() => {
      const adminMessage = {
        id: messages.length + 2,
        sender: activeTab === 'admin' ? 'Admin' : 'Tech Support',
        content: `Thank you for your message! We'll get back to you shortly.`,
        timestamp: new Date(),
        isAdmin: true
      };
      
      setMessages(prevMessages => [...prevMessages, adminMessage]);
    }, 1000);
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle sending message on Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-tabs">
          <div 
            className={`chat-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
          >
            Admin
          </div>
          <div 
            className={`chat-tab ${activeTab === 'tech' ? 'active' : ''}`}
            onClick={() => handleTabChange('tech')}
          >
            Tech Support
          </div>
        </div>
        
        <button className="chat-close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`chat-message ${message.isAdmin ? 'admin-message' : 'user-message'}`}
          >
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">{message.sender}</span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div>{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          className="chat-input-field"
          placeholder="Type a message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-button" onClick={handleSendMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;