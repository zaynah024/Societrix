import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/components/Header.css';

const Header = ({ toggleSidebar, onLogout, toggleTheme, darkMode }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      content: 'New event request from Computer Science Society',
      time: '2 hours ago',
      isRead: false
    }
  ]);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard',
      '/add-society': 'Add Society',
      '/event-requests': 'Event Requests',
      '/calendar': 'Calendar',
      '/societies': 'Societies',
      '/reports': 'Reports',
      '/chat': 'Chat',
      '/profile': 'Admin Profile',
    };
    
    return titles[path] || 'Societrix';
  };
  
  const handleProfileClick = () => {
    setShowDropdown(false); 
    navigate('/profile'); 
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    
    if (!showNotifications && notifications.some(n => !n.isRead)) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && 
          !profileDropdownRef.current.contains(event.target) &&
          !event.target.closest('.profile-button')) {
        setShowDropdown(false);
      }
      if (notificationsDropdownRef.current && 
          !notificationsDropdownRef.current.contains(event.target) &&
          !event.target.closest('.notification-button')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header fixed-width">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="title-container">
          <h1 className="page-title">{getPageTitle()}</h1>
        </div>
      </div>
      
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {darkMode ? '🌙' : '☀️'}
        </button>
        
        <div className="notification">
          <button className="notification-button" onClick={handleNotificationClick}>
            🔔
            {getUnreadCount() > 0 && (
              <span className="notification-badge">{getUnreadCount()}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown" ref={notificationsDropdownRef}>
              <div className="notifications-header">
                <h3>Notifications</h3>
                <div className="notifications-actions">
                  {notifications.length > 0 && (
                    <>
                      <button className="notification-action-btn" onClick={handleMarkAllAsRead}>
                        Mark all as read
                      </button>
                      <button className="notification-action-btn" onClick={handleClearNotifications}>
                        Clear all
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                    >
                      <div className="notification-content">{notification.content}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <div className="no-notifications-icon">🔕</div>
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-dropdown">
          <button 
            className="profile-button" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img 
              src="src\images\IMG_7624.JPG" 
              alt="Admin User" 
              className="profile-image" 
            />
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu" ref={profileDropdownRef}>
              <div className="dropdown-header">
                <p className="username">Admin User</p>
                <p className="email">admin@societrix.com</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleProfileClick}>
                Profile
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={onLogout}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
