import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/society/Sidebar';
import '../styles/layouts/Layout.css'; 
import Header from '../components/society/Header';



const Layout =({ onLogout, toggleTheme, darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
  <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <div className="app-content">
      <Header 
        toggleSidebar={toggleSidebar} 
        onLogout={onLogout}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  </div>
);
};

export default Layout;