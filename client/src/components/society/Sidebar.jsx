import { NavLink } from "react-router-dom";
import "../../styles/components/Sidebar.css";
import logo from "../../assets/day-removebg-preview.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="Societrix Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">Societrix</h2>
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? "←" : "→"}
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
                <span className="icon">📋</span>
                <span className="link-text">Society Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/event-calendar"
                className={({ isActive }) => (isActive ? "active" : "")}
                title="Event calender"
              >
                <span className="icon">📝</span>
                <span className="link-text">Event Requests</span>
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
      </div>
    </aside>
  );
};

export default Sidebar;
