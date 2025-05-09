import React from 'react';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import StatCard from '../components/StatCard';
import { getStatusBadgeClass, formatDate } from '../lib/utils';

const Dashboard = () => {
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
      
      <div className="stats-grid">
        <StatCard 
          title="Total Societies" 
          value={totalSocieties}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          }
          linkText="View details"
          linkUrl="/society-management"
        />
        
        <StatCard 
          title="Upcoming Events" 
          value={upcomingEvents}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
          linkText="View details"
          linkUrl="/event-calendar"
        />
        
        <StatCard 
          title="Available Venues" 
          value={availableVenues}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          }
          linkText="View details"
          linkUrl="/venue-booking"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Recent Events */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2 text-primary">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <h2 className="text-lg font-semibold">Recent Events</h2>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Society</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map(event => {
                  const society = societies.find(s => s.id === event.societyId);
                  const venue = venues.find(v => v.id === event.venueId);
                  
                  return (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{society ? society.name : 'Unknown'}</td>
                      <td>{formatDate(new Date(event.date))}</td>
                      <td>{venue ? venue.name : 'Unknown'}</td>
                      <td>
                        <span className={getStatusBadgeClass(event.status)}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {recentEvents.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Active Societies */}
        <div className="card">
          <div className="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2 text-primary">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <h2 className="text-lg font-semibold">Active Societies</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {activeSocieties.map(society => (
              <div key={society.id} className="text-center">
                <div className="mb-1 text-sm font-medium">{society.name}</div>
                <div className="text-xs text-gray-500">Members: <span className="font-medium">{society.memberCount}</span></div>
                <div className="text-xs text-gray-500">Events: <span className="font-medium">{society.eventCount}</span></div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/society-management">
              <button className="btn btn-secondary">
                Manage Societies
              </button>
            </Link>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2 text-primary">
                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
              </svg>
              <h3 className="text-base font-medium">Recent Announcements</h3>
            </div>
            
            {recentAnnouncements.length > 0 ? (
              <div className="mt-2 text-sm">
                <p className="font-medium">{recentAnnouncements[0].title}</p>
                <p className="text-gray-500 mt-1 line-clamp-2">{recentAnnouncements[0].content}</p>
                <Link href="/announcements" className="text-primary mt-2 inline-block">View all announcements</Link>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">No recent announcements</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
