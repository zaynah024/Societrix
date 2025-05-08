
import React from "react";

import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/not-found";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import SocietyManagement from "./pages/SocietyManagement";
import EventCalendar from "./pages/EventCalendar";
import VenueBooking from "./pages/VenueBooking";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import ChatPage from "./pages/ChatPage";
import './styles/App.css';

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/society-management" component={SocietyManagement} />
        <Route path="/event-calendar" component={EventCalendar} />
        <Route path="/venue-booking" component={VenueBooking} />
        <Route path="/announcements" component={Announcements} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate a login for demo purposes
    // In a real app, this would check for an existing session or token
    setTimeout(() => {
      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'johnsmith', password: 'password123' })
      })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Login failed:', error);
        setIsLoading(false);
      });
    }, 500);
  }, []);

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
      <Router />
    </QueryClientProvider>
  );
}

export default App;
