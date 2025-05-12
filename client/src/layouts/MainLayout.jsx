import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/SidebarAdmin';
import Header from '../navigation/HeaderAdmin';
import '../styles/layouts/MainLayout.css';



const MainLayout = ({ onLogout, toggleTheme, darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

 
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