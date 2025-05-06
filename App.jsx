import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'src/styles/App.css';

// Layout & Pages
import MainLayout from 'src/layouts/MainLayout.jsx';
import NotFound from 'src/pages/notfound/NotFound.jsx';

// Admin Pages
import Dashboard from 'src/pages/admin/Dashboard.jsx';
import AddSociety from 'src/pages/admin/AddSociety.jsx';
import EventRequests from 'src/pages/admin/EventRequests';
import Calendar from 'src/pages/admin/Calendar';
import Societies from 'src/pages/admin/Societies';
import Reports from 'src/pages/admin/Reports';
import Chat from 'src/pages/admin/Chat';
import Profile from 'src/pages/admin/Profile';

// Auth Pages
import LoginPage from 'src/pages/Login/LoginPage.jsx';
import { CreateNewPassword } from 'src/pages/Login/CreateNewPassword.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) setIsAuthenticated(true);

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  return (
    <BrowserRouter>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route path="/change-password" element={<CreateNewPassword />} />

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <MainLayout onLogout={handleLogout} toggleTheme={toggleTheme} darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-society" element={<AddSociety />} />
            <Route path="event-requests" element={<EventRequests />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="societies" element={<Societies />} />
            <Route path="reports" element={<Reports />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
