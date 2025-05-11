import React from "react";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "../../lib/queryClient";
import VenueCard from "../../components/society/VenueCard";
import '../../styles/pages/society/VenueBooking.css';

const VenueBooking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [venueTypeFilter, setVenueTypeFilter] = useState('all');
  
  const queryClient = useQueryClient();
  
  const { data: venues, isLoading } = useQuery({
    queryKey: ['/api/venues'],
  });
  
  const bookVenueMutation = useMutation({
    mutationFn: async (venue) => {
      // In a real app, you would pass user ID and event ID
      return apiRequest('POST', '/api/bookings', {
        venueId: venue.id,
        userId: 1, // mocked ID
        eventId: 1, // mocked ID
        date: new Date(),
        status: 'pending',
      });
    },
    onSuccess: () => {
      // Refetch venues after booking
      queryClient.invalidateQueries({ queryKey: ['/api/venues'] });
      alert('Venue booking request submitted successfully!');
    },
    onError: (error) => {
      console.error('Booking error:', error);
      alert('Failed to book venue. Please try again.');
    }
  });
  
  const handleBookVenue = async (venue) => {
    await bookVenueMutation.mutateAsync(venue);
  };
  
  // Filter venues based on search term and filters
  const filteredVenues = venues ? venues.filter(venue => {
    // Check if venue name matches search term
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if venue capacity matches filter
    let matchesCapacity = true;
    if (capacityFilter !== 'all') {
      if (capacityFilter === 'small' && venue.capacity > 50) matchesCapacity = false;
      if (capacityFilter === 'medium' && (venue.capacity <= 50 || venue.capacity > 200)) matchesCapacity = false;
      if (capacityFilter === 'large' && venue.capacity <= 200) matchesCapacity = false;
    }
    
    // Check if venue type matches filter (simplified approach)
    let matchesType = true;
    if (venueTypeFilter !== 'all') {
      const typeToFeatureMap = {
        'auditoriums': ['Stage'],
        'conference': ['Video Conferencing'],
        'outdoor': ['Open Air']
      };
      
      if (venueTypeFilter in typeToFeatureMap) {
        matchesType = venue.features.some(feature => 
          typeToFeatureMap[venueTypeFilter].includes(feature)
        );
      }
    }
    
    return matchesSearch && matchesCapacity && matchesType;
  }) : [];
  
  return (
    <div>
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Venue Booking</h1>
          <p className="page-description">Search and book venues for your events</p>
        </div>
        
        <button className="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          My Bookings
        </button>
      </div>
      
      {/* Venue Search & Filters */}
      <div className="venue-filters mb-6">
        <div className="search-field">
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search venues..." 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <select 
            className="capacity-filter" 
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
          >
            <option value="all">All Capacities</option>
            <option value="small">Up to 50</option>
            <option value="medium">51 - 200</option>
            <option value="large">201+</option>
          </select>
          
          <select 
            className="venue-filter"
            value={venueTypeFilter}
            onChange={(e) => setVenueTypeFilter(e.target.value)}
          >
            <option value="all">All Venues</option>
            <option value="auditoriums">Auditoriums</option>
            <option value="conference">Conference Rooms</option>
            <option value="outdoor">Outdoor Spaces</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-screen" style={{ height: '300px' }}>
          <div className="loading-spinner"></div>
          <p>Loading venues...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.length > 0 ? (
            filteredVenues.map(venue => (
              <VenueCard 
                key={venue.id} 
                venue={venue} 
                onBook={handleBookVenue}
              />
            ))
          ) : (
            <div className="col-span-3 empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="mt-2">No venues match your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VenueBooking;
