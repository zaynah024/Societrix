import React from "react";

import { useState } from 'react';
import { apiRequest } from '../../lib/queryClient';

const VenueCard = ({ venue, onBook }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBooking = async () => {
    if (!venue.available) return;
    
    setIsLoading(true);
    try {
      await onBook(venue);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCheckAvailability = () => {
    // In a real app, this would show a calendar or redirect to a booking page
    alert(`${venue.name} is currently booked. Please check other dates.`);
  };
  
  return (
    <div className="venue-card">
      <div className="venue-card-body">
        <h3 className="venue-card-title">{venue.name}</h3>
        
        <div className="venue-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>Capacity: {venue.capacity}</span>
        </div>
        
        <div className="venue-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>Status:</span>
          <span className={venue.available ? 'status-available venue-status' : 'status-booked venue-status'}>
            {venue.available ? 'Available Today' : 'Booked Today'}
          </span>
        </div>
        
        <p className="venue-features-title">Features:</p>
        <div className="features-list">
          {venue.features.map((feature, index) => (
            <span key={index} className="feature-pill">{feature}</span>
          ))}
        </div>
        
        <button
          className={`btn ${venue.available ? 'btn-primary' : 'btn-secondary'} btn-block`}
          onClick={venue.available ? handleBooking : handleCheckAvailability}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : venue.available ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Book Venue
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Check Availability
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VenueCard;
