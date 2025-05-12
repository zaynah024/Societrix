import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents } from '../features/events/eventSlice.mjs';
import "../styles/components/Header.css";

const Header = ({ toggleSidebar, onLogout, toggleTheme, darkMode, user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  // Initialize with empty array as default to avoid "events.filter is not a function" error
  const eventsState = useSelector((state) => state.events || {});
  const events = Array.isArray(eventsState.events) ? eventsState.events : [];
  
  // State to track which notifications have been read
  const [readNotifications, setReadNotifications] = useState(new Set());

  // Get society-specific notifications (approved events, etc)
  const notifications = events
    .filter(event => 
      event && 
      event.status === 'approved' && 
      user?.societyId && 
      event.societyId === user.societyId
    )
    .map(event => ({
      id: event._id,
      content: `Your event "${event.eventName}" has been approved!`,
      time: new Date(event.updatedAt || event.createdAt || Date.now()).toLocaleString(),
      isRead: readNotifications.has(event._id),
      eventId: event._id
    }));

  useEffect(() => {
    // Fetch events when component mounts
    try {
      dispatch(fetchEvents());
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [dispatch]);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/society-dashboard': 'Society Dashboard',
      '/society-management': 'Society Management',
      '/event-calendar': 'Event Calendar',
      '/reports': 'Event Reports',
      '/chat-page': 'Chat',
      '/settings': 'Settings',
    };
    
    return titles[path] || 'Societrix';
  };

  const handleProfileClick = () => {
    setShowDropdown(false); 
    navigate('/settings'); 
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    
    if (!showNotifications) {
      // Mark all as read when opening notifications
      const newReadSet = new Set(readNotifications);
      notifications.forEach(n => newReadSet.add(n.id));
      setReadNotifications(newReadSet);
    }
  };

  const getUnreadCount = () => {
    if (!Array.isArray(notifications)) return 0;
    return notifications.filter(n => !n.isRead).length;
  };

  const handleMarkAllAsRead = () => {
    if (!Array.isArray(notifications)) return;
    
    const newReadSet = new Set(readNotifications);
    notifications.forEach(n => newReadSet.add(n.id));
    setReadNotifications(newReadSet);
  };

  const handleNotificationItemClick = (eventId) => {
    // Navigate to event details page
    navigate(`/event-calendar?highlight=${eventId}`);
    setShowNotifications(false);
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
  
  const avatarInitial = user?.name ? user.name.charAt(0) : 'S';

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
                {Array.isArray(notifications) && notifications.length > 0 && (
                  <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="notifications-list">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => handleNotificationItemClick(notification.eventId)}
                    >
                      <div className="notification-content">{notification.content}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <div className="no-notifications-icon">✓</div>
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
            <div className="profile-image" style={{ backgroundColor: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {avatarInitial}
            </div>
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu" ref={profileDropdownRef}>
              <div className="dropdown-header">
                <p className="username">{user?.name || 'Society User'}</p>
                <p className="email">{user?.email || 'society@example.com'}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleProfileClick}>
                Profile Settings
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