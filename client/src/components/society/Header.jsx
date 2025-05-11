import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/pages/society/Header.css";


const Header = () => {
  const [hasNotifications, setHasNotifications] = useState(true);
  
  
  
  return (
    <header className="header">
      
      
      <div className="mobile-brand">Societrix</div>
      
      <div className="header-actions">
        <button className="notification-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {hasNotifications && <span className="notification-indicator"></span>}
        </button>

        <div className="user-dropdown">
            <Link to="/settings">Profile</Link>
            <div className="dropdown-divider"></div>
            <Link to="/">Logout</Link>
          </div>
        
        
        
      </div>
      
    </header>
  );
};

export default Header;
