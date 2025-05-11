import React from "react";

import { useState,useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "../../lib/queryClient";


const applyFontSize = (size) => {
  let rootFontSize;
  switch(size) {
    case 'small':
      rootFontSize = '14px';
      break;
    case 'large':
      rootFontSize = '18px';
      break;
    case 'medium':
    default:
      rootFontSize = '16px';
  }
  
  // Apply font size to html element
  document.documentElement.style.fontSize = rootFontSize;
  
  // Also add class for additional styling if needed
  document.documentElement.classList.remove('font-small', 'font-medium', 'font-large');
  document.documentElement.classList.add(`font-${size}`);
  
  // Apply font size to body for better coverage
  document.body.style.fontSize = rootFontSize;
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    role: '',
    department: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  // Apply saved font size on component mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    applyFontSize(savedFontSize);
    
    // Apply saved theme on component mount
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);
  
  const queryClient = useQueryClient();
  
  // In a real app, you would get the current user's ID from auth context/state
  const userId = 1;
  
  const { data: user, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
    onSuccess: (userData) => {
      if (userData && !isEditing) {
        setFormData({
          displayName: userData.displayName || '',
          email: userData.email || '',
          role: userData.role || '',
          department: userData.department || ''
        });
      }
    }
  });
  
  const updateUserMutation = useMutation({
    mutationFn: async (userData) => {
      return apiRequest('PATCH', `/api/users/${userId}`, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      alert('Failed to update profile. Please try again.');
    }
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserMutation.mutateAsync(formData);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to current user data
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        role: user.role || '',
        department: user.department || ''
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-screen" style={{ height: '300px' }}>
        <div className="loading-spinner"></div>
        <p>Loading user settings...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Manage your preferences and account settings</p>
      </div>
      
      <div className="card">
        <div className="tabs">
          <div className="tab-list">
            <div 
              className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </div>
            <div 
              className={`tab-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </div>
          </div>
        </div>
        
        {activeTab === 'profile' && (
          <div className="society-tab-content">
            <h3 className="text-lg font-medium mb-6">Profile Settings</h3>
            <p className="text-sm text-gray-500 mb-6">Update your personal information and account settings</p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-group">
                    <label htmlFor="displayName" className="form-label">Display Name</label>
                    <input 
                      type="text" 
                      id="displayName"
                      name="displayName"
                      className="form-input"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">Role</label>
                    <input 
                      type="text" 
                      id="role"
                      name="role"
                      className="form-input"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="department" className="form-label">Department</label>
                    <input 
                      type="text" 
                      id="department"
                      name="department"
                      className="form-input"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={updateUserMutation.isPending}
                      >
                        {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
        
        
        
        {activeTab === 'appearance' && (
          <div className="society-tab-content">
            <h3 className="settings-section-title">Appearance Settings</h3>
            <p className="settings-description">Customize your application appearance</p>
            
            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="theme" className="form-label">Theme</label>
                <select 
                  id="theme" 
                  className="form-select"
                  value={localStorage.getItem('theme') || 'light'}
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    localStorage.setItem('theme', newTheme);
                    
                    // Apply theme immediately
                    if (newTheme === 'dark') {
                      document.body.classList.add('dark-mode');
                    } else {
                      document.body.classList.remove('dark-mode');
                    }
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="fontSize" className="form-label">Font Size</label>
                <select 
                  id="fontSize" 
                  className="form-select"
                  value={localStorage.getItem('fontSize') || 'medium'}
                  onChange={(e) => {
                    const newSize = e.target.value;
                    localStorage.setItem('fontSize', newSize);
                    
                    // Apply font size immediately
                    document.documentElement.setAttribute('data-font-size', newSize);
                    applyFontSize(newSize);
                  }}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              

              
              <div className="form-actions">
                <button type="button" className="btn btn-primary">
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
