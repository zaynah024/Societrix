import React from "react";
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import DocumentUploader from './DocumentUploader';
import '../../styles/pages/society/EventReportForm.css';

const EventReportForm = ({ event, onClose }) => {
  const [reportData, setReportData] = useState({
    summary: '',
    attendance: '',
    feedback: '',
    budget: '',
    recommendations: '',
    attachments: []
  });
  
  const queryClient = useQueryClient();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFilesUploaded = (files) => {
    setReportData(prev => ({
      ...prev,
      attachments: files
    }));
  };
  
  const submitReportMutation = useMutation({
    mutationFn: async (data) => {
      // In a real app, we would likely update the event with a report field
      // or create a separate event reports collection
      const reportPayload = {
        ...data,
        eventId: event.id,
        submittedAt: new Date()
      };
      
      // For now, just update the event status to indicate a report was submitted
      return apiRequest('PATCH', `/api/events/${event.id}`, {
        status: 'completed'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error('Error submitting report:', error);
      alert('Failed to submit event report. Please try again.');
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    submitReportMutation.mutateAsync(reportData);
  };
  
  return (
    <div className="event-report-form">
      <h2 className="form-title">Submit Event Report: {event.title}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="summary" className="form-label">Event Summary</label>
          <textarea
            id="summary"
            name="summary"
            className="form-input"
            rows="3"
            value={reportData.summary}
            onChange={handleInputChange}
            required
            placeholder="Provide a brief summary of the event"
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="attendance" className="form-label">Attendance</label>
            <input
              type="number"
              id="attendance"
              name="attendance"
              className="form-input"
              value={reportData.attendance}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="Number of attendees"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="budget" className="form-label">Budget Utilized</label>
            <div className="form-input-group">
              <span className="form-input-addon">$</span>
              <input
                type="number"
                id="budget"
                name="budget"
                className="form-input with-addon"
                value={reportData.budget}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="feedback" className="form-label">Attendee Feedback</label>
          <textarea
            id="feedback"
            name="feedback"
            className="form-input"
            rows="3"
            value={reportData.feedback}
            onChange={handleInputChange}
            required
            placeholder="Summarize feedback received from attendees"
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="recommendations" className="form-label">Recommendations for Future</label>
          <textarea
            id="recommendations"
            name="recommendations"
            className="form-input"
            rows="3"
            value={reportData.recommendations}
            onChange={handleInputChange}
            placeholder="Suggestions for improvement in future events"
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
        
        <div className="form-group mt-6">
          <label className="form-label">Supporting Documents</label>
          <p className="form-hint">Upload photos, receipts, attendance sheets, or other relevant documents</p>
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
            disabled={submitReportMutation.isPending}
          >
            {submitReportMutation.isPending ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventReportForm;