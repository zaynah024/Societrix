import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/components/Sidebar.css';
import logo from "../../assets/day-removebg-preview.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [topSocieties, setTopSocieties] = useState([]);

  useEffect(() => {
    // This would typically be an API call
    // For now, we'll use mock data
    setTopSocieties([
      { id: 1, name: "Computer Science Society", rating: 4.9 },
      { id: 2, name: "Drama Club", rating: 4.8 },
      { id: 3, name: "Physics Society", rating: 4.7 },
      { id: 4, name: "Debate Club", rating: 4.6 },
    ]);
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="Societrix Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">Societrix</h2>
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? '←' : '→'}
        </button>
      </div>

      <div className="sidebar-content">
        <div className="main-menu">
          <h3>MAIN MENU</h3>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? 'active' : ''}
                title="Dashboard"
              >
                <span className="icon">📊</span>
                <span className="link-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/add-society" 
                className={({ isActive }) => isActive ? 'active' : ''}
                title="Add Society"
              >
                <span className="icon">➕</span>
                <span className="link-text">Add Society</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/event-requests" 
                className={({ isActive }) => isActive ? 'active' : ''}
                title="Event Requests"
              >
                <span className="icon">📝</span>
                <span className="link-text">Event Requests</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => isActive ? 'active' : ''}
                title="Calendar"
              >
                <span className="icon">📅</span>
                <span className="link-text">Calendar</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/societies" 
                className={({ isActive }) => isActive ? 'active' : ''}
                title="Societies"
              >
                <span className="icon">👥</span>
                <span className="link-text">Societies</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reports" 
                className={({ isActive }) => isActive ? 'active' : ''}
                title="Reports"
              >
                <span className="icon">📊</span>
                <span className="link-text">Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/chat" 
                className={({ isActive }) => isActive ? 'active' : ''}
                title="Chat"
              >
                <span className="icon">💬</span>
                <span className="link-text">Chat</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {isOpen && (
          <div className="top-societies">
            <h3>TOP SOCIETIES</h3>
            <ul>
              {topSocieties.map(society => (
                <li key={society.id}>
                  <span className="society-name">{society.name}</span>
                  <span className="society-rating">★ {society.rating}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
