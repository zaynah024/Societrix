import React from "react";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "../../lib/queryClient";
import AnnouncementItem from "../../components/society/AnnouncementItem";
import '../../styles/pages/society/Announcements.css';

const Announcements = () => {
  const [newAnnouncementOpen, setNewAnnouncementOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const queryClient = useQueryClient();
  
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['/api/announcements'],
  });
  
  const createAnnouncementMutation = useMutation({
    mutationFn: async (newAnnouncement) => {
      return apiRequest('POST', '/api/announcements', newAnnouncement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setNewAnnouncementOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    }
  });
  
  const resetForm = () => {
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setPriority('medium');
  };
  
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    
    // Get the user information (in a real app, this would come from auth context)
    const user = { displayName: 'John Smith' };
    
    createAnnouncementMutation.mutateAsync({
      title: announcementTitle,
      content: announcementContent,
      author: user.displayName,
      date: new Date(),
      priority: priority
    });
  };
  
  return (
    <div>
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-description">Important updates and notices for all societies</p>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => setNewAnnouncementOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Announcement
        </button>
      </div>
      
      {newAnnouncementOpen && (
        <div className="card mb-6">
          <h2 className="text-lg font-medium mb-4">Create New Announcement</h2>
          
          <form onSubmit={handleCreateAnnouncement}>
            <div className="form-group">
              <label htmlFor="announcement-title" className="form-label">Title</label>
              <input
                id="announcement-title"
                type="text"
                className="form-input"
                placeholder="Announcement title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="announcement-content" className="form-label">Content</label>
              <textarea
                id="announcement-content"
                className="form-input"
                placeholder="Announcement content"
                rows="4"
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select
                id="priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setNewAnnouncementOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={createAnnouncementMutation.isPending}
              >
                {createAnnouncementMutation.isPending ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-screen" style={{ height: '300px' }}>
          <div className="loading-spinner"></div>
          <p>Loading announcements...</p>
        </div>
      ) : announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <AnnouncementItem key={announcement.id} announcement={announcement} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
          </svg>
          <p className="mt-2">No announcements found</p>
        </div>
      )}
    </div>
  );
};

export default Announcements;
