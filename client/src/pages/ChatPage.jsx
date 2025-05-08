import React from 'react';

const ChatPage = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Chat</h1>
        <p className="page-description">Communicate with administrators and society members</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Chat Contacts</h2>
            <div className="space-y-2">
              <div className="chat-contact active">
                <div className="chat-contact-avatar admin">
                  <span>A</span>
                </div>
                <div className="chat-contact-info">
                  <h3 className="chat-contact-name">Admin Support</h3>
                  <p className="chat-contact-preview">How can we help you today?</p>
                </div>
                <div className="chat-contact-meta">
                  <span className="chat-contact-time">10:30 AM</span>
                  <span className="chat-contact-badge">2</span>
                </div>
              </div>
              
              <div className="chat-contact">
                <div className="chat-contact-avatar">
                  <span>CS</span>
                </div>
                <div className="chat-contact-info">
                  <h3 className="chat-contact-name">Computer Science Society</h3>
                  <p className="chat-contact-preview">The next meeting is scheduled for...</p>
                </div>
                <div className="chat-contact-meta">
                  <span className="chat-contact-time">Yesterday</span>
                </div>
              </div>
              
              <div className="chat-contact">
                <div className="chat-contact-avatar">
                  <span>BC</span>
                </div>
                <div className="chat-contact-info">
                  <h3 className="chat-contact-name">Business Club</h3>
                  <p className="chat-contact-preview">Thank you for joining our event!</p>
                </div>
                <div className="chat-contact-meta">
                  <span className="chat-contact-time">Monday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="card full-height">
            <div className="chat-header-main">
              <div className="chat-header-info">
                <div className="chat-avatar admin">
                  <span>A</span>
                </div>
                <div>
                  <h3 className="chat-contact-name">Admin Support</h3>
                  <p className="chat-status">Online</p>
                </div>
              </div>
            </div>
            
            <div className="chat-main">
              <div className="chat-message admin-message">
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">Admin</span>
                    <span className="message-time">10:30 AM</span>
                  </div>
                  <p>Welcome to the society chat. How can we help you today?</p>
                </div>
              </div>
              
              <div className="chat-message user-message">
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">You</span>
                    <span className="message-time">10:32 AM</span>
                  </div>
                  <p>I need information about the next Computer Science Society meeting.</p>
                </div>
              </div>
              
              <div className="chat-message admin-message">
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">Admin</span>
                    <span className="message-time">10:33 AM</span>
                  </div>
                  <p>The next meeting is scheduled for May 15th at 3:00 PM in Conference Hall A. It will cover the upcoming tech exhibition preparations.</p>
                </div>
              </div>
            </div>
            
            <div className="chat-footer">
              <form className="chat-input-main">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="chat-input-field-main"
                />
                <button type="submit" className="chat-send-button-main">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;