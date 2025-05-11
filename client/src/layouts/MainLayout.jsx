import { useState,useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/SidebarAdmin';
import Header from '../navigation/HeaderAdmin';
import '../styles/layouts/MainLayout.css';
import { loadStyle, unloadStyle } from '../lib/styleLoader';



const MainLayout = ({ onLogout, toggleTheme, darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    loadStyle('admin-style', '../styles/pages/index.css'); 
    return () => unloadStyle('admin-style');
  }, []);

  return (
    <div className="main-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content-area ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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

export default MainLayout;