import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllEvents } from '../features/events/eventSlice.mjs';
import '../styles/components/Header.css';

const Header = ({ toggleSidebar, onLogout, toggleTheme, darkMode }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  // Get events and societies from Redux store with proper default values
  const eventsState = useSelector((state) => state.events || {});
  const events = Array.isArray(eventsState.events) ? eventsState.events : [];
  
  const societyState = useSelector((state) => state.society || {});
  const societies = Array.isArray(societyState.societies) ? societyState.societies : [];
  
  // State to track which notifications have been read
  const [readNotifications, setReadNotifications] = useState(new Set());

  // Generate notifications from pending events with proper error handling
  const notifications = events
    .filter(event => event && event.status === 'pending')
    .map(event => {
      const society = societies.find(s => s && s._id === event.societyId);
      const societyName = society ? society.name : 'Unknown Society';
      
      return {
        id: event._id,
        content: `${societyName} requested approval for their event "${event.eventName}"`,
        time: new Date(event.createdAt || Date.now()).toLocaleString(),
        isRead: readNotifications.has(event._id),
        eventId: event._id
      };
    });

  useEffect(() => {
    // Fetch events when component mounts, with error handling
    try {
      dispatch(getAllEvents());
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [dispatch]);

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
    
    if (!showNotifications) {
      // Mark all as read when opening notifications
      const newReadSet = new Set(readNotifications);
      notifications.forEach(n => newReadSet.add(n.id));
      setReadNotifications(newReadSet);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const handleMarkAllAsRead = () => {
    const newReadSet = new Set(readNotifications);
    notifications.forEach(n => newReadSet.add(n.id));
    setReadNotifications(newReadSet);
  };

  const handleClearNotifications = () => {
    // We can't actually clear pending events, but we can mark them all as read
    handleMarkAllAsRead();
  };
  
  const handleNotificationItemClick = (eventId) => {
    // Navigate to event details or event requests page
    navigate(`/event-requests?highlight=${eventId}`);
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
                <h3>Event Approval Requests</h3>
              </div>
              
              <div className="notifications-list">
                {notifications.length > 0 ? (
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
                    <p>No pending event approvals</p>
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
              src="src\assets\IMG_7624.JPG" 
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
