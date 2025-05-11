import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./styles/App.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./features/Authentication/authenticatorSlice.mjs";

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
import SocietyDashboard from "./pages/society/SocietyDashboard";


// Auth Pages
import LoginPage from "./pages/Login/LoginPage.jsx";
import { CreateNewPassword } from "./pages/Login/CreateNewPassword.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get authentication state from Redux
  const isAuthenticated = useSelector((state) => state.auth.authenticator);
  const userType = useSelector((state) => state.auth.userType);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    // Check for theme preference
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const handleLogout = () => {
    dispatch(logout());
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
                  <Navigate to={userType === "admin" ? "/dashboard" : "/society-management"} />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route path="/change-password" element={<CreateNewPassword />} />

            {/* Admin Routes with MainLayout */}
            <Route
              element={
                isAuthenticated && userType === "admin" ? (
                  <MainLayout
                    onLogout={handleLogout}
                    toggleTheme={toggleTheme}
                    darkMode={darkMode}
                    user={user}
                  />
                ) : (
                  <Navigate to="/" replace={false} />
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

            {/* Society Routes with Society Layout */}
            <Route
              element={
                isAuthenticated && userType === "society" ? (
                  <Layout
                    onLogout={handleLogout}
                    toggleTheme={toggleTheme}
                    darkMode={darkMode}
                    user={user}
                  />
                ) : (
                  <Navigate to="/" replace={false} />
                )
              }
            >
              <Route
  element={
    isAuthenticated && userType === "society" ? (
      <Layout
        onLogout={handleLogout}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        user={user}
      />
    ) : (
      <Navigate to="/" replace={false} />
    )
  }
>
  <Route path="society-management" element={<SocietyManagement />} />
  <Route path="society-dashboard" element={<SocietyDashboard />} />
  <Route path="event-calendar" element={<EventCalendar />} />
  <Route path="venue-booking" element={<VenueBooking />} />
  <Route path="announcements" element={<Announcements />} />
  <Route path="settings" element={<Settings />} />
  <Route path="chat-page" element={<ChatPage />} />
</Route>
</Route>
             

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
