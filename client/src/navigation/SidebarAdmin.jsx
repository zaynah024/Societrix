import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocieties } from '../features/society/societySlice.mjs';
import '../styles/components/Sidebar.css';
import logo from "../assets/day-removebg-preview.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const { societies } = useSelector((state) => state.society);
  const [topSocieties, setTopSocieties] = useState([]);

  useEffect(() => {
    // Fetch societies whenever the sidebar is opened
    dispatch(fetchSocieties());
  }, [dispatch, isOpen]); // Re-fetch when sidebar is opened to ensure fresh data

  useEffect(() => {
    // When societies data changes, update top societies
    if (societies && societies.length > 0) {
      // Create a copy to avoid mutating the original state
      const sortedSocieties = [...societies]
        // Sort by ratings in descending order
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        // Take top 4
        .slice(0, 4);
      
      setTopSocieties(sortedSocieties);
    }
  }, [societies]);

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
              {topSocieties.length > 0 ? (
                topSocieties.map(society => (
                  <li key={society._id}>
                    <span className="society-name">{society.name}</span>
                    <span className="society-rating">★ {society.rating ? society.rating.toFixed(1) : 'N/A'}</span>
                  </li>
                ))
              ) : (
                <li className="no-societies">No societies available</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
