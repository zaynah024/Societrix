import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { initializeChatSystem } from "./services/chatService";
import "./styles/App.css";

// Layout & Pages
import MainLayout from "./layouts/MainLayout.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import Layout from "./layouts/Layout.jsx";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AddSociety from "./pages/admin/AddSociety.jsx";
import EventRequests from "./pages/admin/EventRequests";
import Calendar from "./pages/admin/Calendar";
import Societies from "./pages/admin/Societies";
import Reports from "./pages/admin/Reports";
import Chat from "./pages/admin/Chat";
import Profile from "./pages/admin/Profile";

// Other Pages
import SocietyManagement from "./pages/society/SocietyManagement";
import EventCalendar from "./pages/society/EventCalendar";
import VenueBooking from "./pages/society/VenueBooking";
import Announcements from "./pages/society/Announcements";
import Settings from "./pages/society/Settings";
import ChatPage from "./pages/society/ChatPage";

// Auth Pages
import LoginPage from "./pages/Login/LoginPage.jsx";
import { CreateNewPassword } from "./pages/Login/CreateNewPassword.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [chatSystemInitialized, setChatSystemInitialized] = useState(false);

  useEffect(() => {
    // Simulate a login for demo purposes
    setTimeout(() => {
      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "johnsmith", password: "password123" }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setIsAuthenticated(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Login failed:", error);
          setIsLoading(false);
        });
    }, 500);

    // Check for theme preference
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }

    // Initialize chat system
    const setupChatSystem = async () => {
      try {
        console.log('Initializing chat system...');
        const result = await initializeChatSystem();
        console.log('Chat system initialized:', result);
        setChatSystemInitialized(true);
      } catch (error) {
        console.error('Failed to initialize chat system:', error);
        // Continue anyway, as it's not critical
        setChatSystemInitialized(true);
      }
    };

    setupChatSystem();
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("auth", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Societrix...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className={`app ${darkMode ? "dark-mode" : ""}`}>
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
                  <MainLayout
                    onLogout={handleLogout}
                    toggleTheme={toggleTheme}
                    darkMode={darkMode}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            >
              {/* Admin Pages */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-society" element={<AddSociety />} />
              <Route path="event-requests" element={<EventRequests />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="societies" element={<Societies />} />
              <Route path="reports" element={<Reports />} />
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<Profile />} />

              {/* Society Pages */}
              <Route path="society-management" element={<SocietyManagement />} />
              <Route path="event-calendar" element={<EventCalendar />} />
              <Route path="venue-booking" element={<VenueBooking />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chat-page" element={<ChatPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;