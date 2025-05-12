import React from "react";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import DocumentUploader from './DocumentUploader';
import '../../styles/pages/society/EventForm.css';

const EventForm = ({ onClose }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    societyId: '',
    venueId: '',
    sponsorships: '',
    attachments: []
  });
  
  const queryClient = useQueryClient();
  
  const { data: societies, isLoading: isLoadingSocieties } = useQuery({
    queryKey: ['/api/societies'],
  });
  
  const { data: venues, isLoading: isLoadingVenues } = useQuery({
    queryKey: ['/api/venues'],
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFilesUploaded = (files) => {
    setEventData(prev => ({
      ...prev,
      attachments: files
    }));
  };
  
  const createEventMutation = useMutation({
    mutationFn: async (data) => {
      
      const eventPayload = {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        societyId: parseInt(data.societyId),
        venueId: parseInt(data.venueId),
        status: 'pending' // All new events start as pending
      };
      
      return apiRequest('POST', '/api/events', eventPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      alert('Failed to submit event request. Please try again.');
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createEventMutation.mutateAsync(eventData);
  };
  
  return (
    <div className="event-form">
      <h2 className="form-title">Request New Event</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            value={eventData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Event Description</label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            rows="4"
            value={eventData.description}
            onChange={handleInputChange}
            required
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="date" className="form-label">Event Date</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              className="form-input"
              value={eventData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="societyId" className="form-label">Society</label>
            <select
              id="societyId"
              name="societyId"
              className="form-select"
              value={eventData.societyId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a society</option>
              {!isLoadingSocieties && societies && societies.map(society => (
                <option key={society.id} value={society.id}>{society.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="venueId" className="form-label">Venue</label>
            <select
              id="venueId"
              name="venueId"
              className="form-select"
              value={eventData.venueId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a venue</option>
              {!isLoadingVenues && venues && venues.map(venue => (
                <option key={venue.id} value={venue.id}>{venue.name} (Capacity: {venue.capacity})</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="sponsorships" className="form-label">Sponsorships</label>
            <input
              type="text"
              id="sponsorships"
              name="sponsorships"
              className="form-input"
              value={eventData.sponsorships}
              onChange={handleInputChange}
              placeholder="List any sponsors for this event"
            />
          </div>
        </div>
        
        <div className="form-group mt-6">
          <label className="form-label">Event Documents</label>
          <p className="form-hint">Upload any additional documentation for the event (posters, schedules, etc.)</p>
          <DocumentUploader onUpload={handleFilesUploaded} />
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={createEventMutation.isPending}
          >
            {createEventMutation.isPending ? 'Submitting...' : 'Submit Event Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;