import React from "react";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const SocietyManagement = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [selectedSociety, setSelectedSociety] = useState(null);
  
  const { data: societies, isLoading } = useQuery({
    queryKey: ['/api/societies'],
    onSuccess: (data) => {
      if (data && data.length > 0 && !selectedSociety) {
        setSelectedSociety(data[0]);
      }
    }
  });
  
  if (isLoading || !selectedSociety) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading society data...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Society Management</h1>
        <p className="page-description">Manage society details, members, and activities</p>
      </div>
      
      <div className="card">
        <div className="society-profile">
          <div className="society-header">
            <div className="society-info-container">
              <div className="society-logo">{selectedSociety.logoInitials}</div>
              <div>
                <h2 className="society-title">{selectedSociety.name}</h2>
                <p className="society-meta">Founded: {selectedSociety.foundedYear} • {selectedSociety.memberCount} Members</p>
              </div>
            </div>
            
            <div className="society-actions">
              <button className="btn btn-primary">
                Edit Society
              </button>
            </div>
          </div>
          
          <div className="tabs">
            <div className="tab-list">
              <div 
                className={`tab-item ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </div>
              <div 
                className={`tab-item ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                Members
              </div>
              <div 
                className={`tab-item ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                Events
              </div>
            </div>
          </div>
          
          {activeTab === 'about' && (
            <div className="society-tab-content">
              <h3 className="society-section-title">About Society</h3>
              <div className="society-description">
                <p>{selectedSociety.description}</p>
              </div>
              
              <h3 className="society-section-title">Goals & Activities</h3>
              <ul className="society-activities">
                <li>Organize technical workshops and coding competitions</li>
                <li>Host industry talks and career development sessions</li>
                <li>Facilitate networking among computer science students</li>
                <li>Represent student interests to the department faculty</li>
                <li>Provide mentorship for junior students</li>
              </ul>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <button className="btn btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Annual Reports
                </button>
                <button className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Join Society
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'members' && (
            <div className="society-tab-content">
              <h3 className="society-section-title">Society Members</h3>
              <p className="society-description">
                This tab would display a list of all society members, their roles, and contact information.
              </p>
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <p className="mt-2">Member list is currently being updated.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'events' && (
            <div className="society-tab-content">
              <h3 className="society-section-title">Society Events</h3>
              <p className="society-description">
                This tab would display all past and upcoming events for the society.
              </p>
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <p className="mt-2">No events found for this society.</p>
                <button className="btn btn-primary mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocietyManagement;
