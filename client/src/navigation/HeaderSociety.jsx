import React from "react";
import { useState } from 'react';
import UserMenu from '../components/society_components/UserMenu';
import Chat from '../components/society_components/Chat';
import "../styles/components/Header.css";

const Header = ({ toggleSidebar }) => {
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const handleChatOpen = () => {
    setIsChatOpen(true);
  };
  
  const handleChatClose = () => {
    setIsChatOpen(false);
  };
  
  return (
    <header className="header">
      <button className="header-menu-button" onClick={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      <div className="mobile-brand">Societrix</div>
      
      <div className="header-actions">
        <button className="notification-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {hasNotifications && <span className="notification-indicator"></span>}
        </button>
        
        <button className="chat-button notification-button" onClick={handleChatOpen}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        <UserMenu onChatOpen={handleChatOpen} />
      </div>
      
      {isChatOpen && <Chat isOpen={isChatOpen} onClose={handleChatClose} />}
    </header>
  );
};

export default Header;
