import React from "react";

import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import '../styles/UserMenu.css';

const UserMenu = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-button" onClick={toggleMenu}>
        <div className="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="user-dropdown">
          <Link href="/my-account" onClick={() => setIsOpen(false)}>My Account</Link>
          <Link href="/settings" onClick={() => setIsOpen(false)}>Profile</Link>
          <Link href="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
          <Link href="/chat" onClick={() => setIsOpen(false)}>Chat</Link>
          <div 
            className="user-dropdown-item" 
            onClick={() => {
              setIsOpen(false);
              if (onChatOpen) onChatOpen();
            }}
          >
            Quick Chat
          </div>
          <div className="dropdown-divider"></div>
          <Link href="/logout" onClick={() => setIsOpen(false)}>Logout</Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
