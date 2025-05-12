import { NavLink } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocieties } from '../features/society/societySlice.mjs';
import "../styles/components/Sidebar.css";
import logo from "../assets/day-removebg-preview.png";

const SidebarSociety = ({ isOpen, toggleSidebar }) => {
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
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
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
                to="/society-dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
                title="Dashboard"
              >
                <span className="icon">📊</span>
                <span className="link-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/society-management"
                className={({ isActive }) => (isActive ? "active" : "")}
                title="Society Management"
              >
                <span className="icon">👥</span>
                <span className="link-text">Society Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/event-calendar"
                className={({ isActive }) => (isActive ? "active" : "")}
                title="Events"
              >
                <span className="icon">📅</span>
                <span className="link-text">Event Requests</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/society-reports" // Ensure the correct path is used
                className={({ isActive }) => (isActive ? "active" : "")}
                title="Reports"
              >
                <span className="icon">📝</span>
                <span className="link-text">Event Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chat-page"
                className={({ isActive }) => (isActive ? "active" : "")}
                title="Chat"
              >
                <span className="icon">💬</span>
                <span className="link-text">Chat</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) => (isActive ? "active" : "")}
                title="Settings"
              >
                <span className="icon">⚙️</span>
                <span className="link-text">Settings</span>
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

        <div className="sidebar-footer">
          <p>Societrix v1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default SidebarSociety;
