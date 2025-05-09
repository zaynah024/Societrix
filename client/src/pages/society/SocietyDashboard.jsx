import React from 'react';

import { useQuery } from '@tanstack/react-query';
import '../../styles/pages/society/Dashboard.css';

const SocietyDashboard = () => {
  const { data: societies, isLoading: isLoadingSocieties } = useQuery({
    queryKey: ['/api/societies'],
  });
  
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['/api/events'],
  });
  
  const { data: venues, isLoading: isLoadingVenues } = useQuery({
    queryKey: ['/api/venues'],
  });
  
  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ['/api/announcements'],
  });
  
  const isLoading = isLoadingSocieties || isLoadingEvents || isLoadingVenues || isLoadingAnnouncements;
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  const totalSocieties = societies ? societies.length : 0;
  const upcomingEvents = events ? events.filter(event => new Date(event.date) > new Date()).length : 0;
  const availableVenues = venues ? venues.filter(venue => venue.available).length : 0;
  
  const recentEvents = events 
    ? events
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
    : [];
    
  const activeSocieties = societies 
    ? societies
        .sort((a, b) => b.memberCount - a.memberCount)
        .slice(0, 4)
    : [];
    
  const recentAnnouncements = announcements
    ? announcements
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 1)
    : [];
  
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Welcome to Societrix - Your campus society management hub</p>
      </div>
      
      {/* Stats Cards - 3 Column Layout */}
      <div className="dashboard-stats-grid">
        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">Total Societies</h3>
            <div className="stats-card-icon society-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="stats-card-value">{totalSocieties}</div>
          <a href="/society-management" className="stats-card-link">
            View details
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">Upcoming Events</h3>
            <div className="stats-card-icon event-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
          <div className="stats-card-value">{upcomingEvents}</div>
          <a href="/event-calendar" className="stats-card-link">
            View details
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <h3 className="stats-card-title">Available Venues</h3>
            <div className="stats-card-icon venue-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
          <div className="stats-card-value">{availableVenues}</div>
          <a href="/venue-booking" className="stats-card-link">
            View details
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>
      </div>

      {/* Recent Events Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-header-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h2 className="card-title">Recent Events</h2>
          </div>
        </div>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>EVENT</th>
                <th>SOCIETY</th>
                <th>DATE</th>
                <th>VENUE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="empty-table-message">No events found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Societies Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-header-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h2 className="card-title">Active Societies</h2>
          </div>
          <a href="/society-management" className="manage-button">Manage Societies</a>
        </div>
        <div className="societies-list">
          <p className="empty-message">No societies to display</p>
        </div>
      </div>
    </div>
  );
};


export default SocietyDashboard;