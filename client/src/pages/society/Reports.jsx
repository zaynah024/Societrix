import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchCompletedEvents, 
  fetchSocietyReports, 
  submitEventReport 
} from '../../features/reports/reportSlice.mjs';
import '../../styles/pages/society/Reports.css';

const Reports = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const reportsState = useSelector((state) => state.reports);
  const navigate = useNavigate(); // Use navigate for programmatic routing
  
  // Initialize with default values to avoid undefined errors
  const { events = [], reports = [], loading = true, error = null } = reportsState || {};
  
  // Filter options
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'submitted'
  
  // Modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Form state
  const [reportForm, setReportForm] = useState({
    summary: '',
    attendees: '',
    achievements: '',
    challenges: '',
    feedback: '',
    photos: []
  });

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  // State for the add report modal
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    eventId: '',
    title: '',
    content: '',
    attachments: [],
    attendeeCount: '',
  });

  const [completedEvents, setCompletedEvents] = useState([]); // Store completed events for dropdown

  useEffect(() => {
    // Track if component is mounted to avoid state updates after unmounting
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        // Only proceed if we have a societyId
        if (user?.societyId) {
          await dispatch(fetchCompletedEvents(user.societyId));
          await dispatch(fetchSocietyReports(user.societyId));
        } else if (user?.email) {
          // If no societyId but we have email, try using that
          await dispatch(fetchCompletedEvents(user.email));
          await dispatch(fetchSocietyReports(user.email));
        }
        
        if (isMounted) {
          setDataFetched(true);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
        if (isMounted) {
          setDataFetched(true);
        }
      }
    };

    fetchData();
    
    // Clean up function
    return () => {
      isMounted = false;
    };
  }, [dispatch, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.email) {
          // Fetch all completed events and reports for the society
          await dispatch(fetchCompletedEvents(user.email));
          await dispatch(fetchSocietyReports(user.email));
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, [dispatch, user]);

  useEffect(() => {
    const fetchCompletedEventsForDropdown = async () => {
      try {
        if (user?.email) {
          const events = await dispatch(fetchCompletedEvents(user.email)).unwrap();
          setCompletedEvents(events);
        }
      } catch (error) {
        console.error('Error fetching completed events for dropdown:', error);
      }
    };

    fetchCompletedEventsForDropdown();
  }, [dispatch, user]);

  // Reset form when modal is opened
  useEffect(() => {
    if (showReportModal && selectedEvent) {
      setReportForm({
        eventId: selectedEvent._id,
        summary: '',
        attendees: selectedEvent.estimatedAttendees || '',
        achievements: '',
        challenges: '',
        feedback: '',
        photos: []
      });
      setUploadProgress(0);
    }
  }, [showReportModal, selectedEvent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isUnderLimit = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isImage) {
        alert(`${file.name} is not an image file`);
      }
      if (!isUnderLimit) {
        alert(`${file.name} exceeds the 5MB size limit`);
      }
      
      return isImage && isUnderLimit;
    });
    
    if (validFiles.length > 0) {
      // Convert images to base64
      const imagePromises = validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = e => resolve({
            data: e.target.result,
            name: file.name,
            type: file.type,
            size: file.size
          });
          reader.readAsDataURL(file);
        });
      });
      
      // When all promises resolve, update state
      Promise.all(imagePromises).then(images => {
        setReportForm(prev => ({
          ...prev,
          photos: [...prev.photos, ...images]
        }));
      });
    }
  };
  
  const removePhoto = (index) => {
    setReportForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  
  const handleCreateReport = (event) => {
    setSelectedEvent(event);
    setShowReportModal(true);
  };
  
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };
  
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!reportForm.summary || !reportForm.attendees) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 200);
      
      // Submit report
      await dispatch(submitEventReport({
        ...reportForm,
        societyId: user?.societyId,
        eventId: selectedEvent._id
      })).unwrap();
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowReportModal(false);
        setIsSubmitting(false);
        setUploadProgress(0);
        // Refresh reports
        if (user?.societyId) {
          dispatch(fetchSocietyReports(user.societyId));
          dispatch(fetchCompletedEvents(user.societyId));
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setIsSubmitting(false);
      setUploadProgress(0);
      alert('Failed to submit report. Please try again.');
    }
  };
  
  // Helper to check if an event already has a report
  const hasReport = (eventId) => {
    return reports.some(report => report.eventId === eventId);
  };
  
  // Filter events based on selected filter
  const filteredEvents = Array.isArray(events) ? events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !hasReport(event._id);
    if (filter === 'submitted') return hasReport(event._id);
    return true;
  }) : [];

  const handleAddReportInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReportSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!newReport.eventId || !newReport.title || !newReport.content || !newReport.attendeeCount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...newReport,
        submissionDate: new Date().toISOString(),
        rating: 5,
      };

      await dispatch(submitEventReport(payload)).unwrap();

      setShowAddReportModal(false);
      setNewReport({
        eventId: '',
        title: '',
        content: '',
        attachments: [],
        attendeeCount: '',
      });

      // Re-fetch all reports for the society
      if (user?.email) {
        await dispatch(fetchSocietyReports(user.email));
      }

      alert('Report added successfully!');
    } catch (error) {
      console.error('Error adding report:', error);
      alert('Failed to add report. Please try again.');
    }
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    const attachments = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    }));
    setNewReport((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...attachments],
    }));
  };

  const removeAttachment = (index) => {
    setNewReport((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // If data hasn't been fetched yet or is loading, show a loading indicator
  if (loading && !dataFetched) {
    return (
      <div className="society-reports-page">
        <div className="page-header">
          <h1 className="page-title">Event Reports</h1>
          <p className="page-description">Create and manage reports for your completed events</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  // If there was an error fetching the data
  if (error && dataFetched) {
    return (
      <div className="society-reports-page">
        <div className="page-header">
          <h1 className="page-title">Event Reports</h1>
          <p className="page-description">Create and manage reports for your completed events</p>
        </div>
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3>Error loading reports</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="society-reports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Reports</h1>
          <p className="page-description">Create and manage reports for your completed events</p>
        </div>
        
        <div className="filter-controls">
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Events</option>
            <option value="pending">Pending Reports</option>
            <option value="submitted">Submitted Reports</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">📊</div>
          <h3>No events found</h3>
          <p>
            {filter === 'all' ? 'You have no completed events yet.' :
             filter === 'pending' ? 'All your completed events have reports.' :
             'You haven\'t submitted any reports yet.'}
          </p>
        </div>
      ) : (
        <div className="events-list">
          {filteredEvents.map(event => {
            const eventReport = reports.find(report => report.eventId === event._id);
            const hasSubmittedReport = !!eventReport;
            
            return (
              <div key={event._id} className="event-card">
                <div className="event-header">
                  <div>
                    <h3 className="event-title">{event.eventName}</h3>
                    <p className="event-date">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="event-status">
                    <span className={hasSubmittedReport ? "status-submitted" : "status-pending"}>
                      {hasSubmittedReport ? 'Report Submitted' : 'Report Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-label">Venue:</span>
                    <span className="detail-value">{event.venue || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Event Time:</span>
                    <span className="detail-value">{event.time || 'Not specified'}</span>
                  </div>
                  {hasSubmittedReport && (
                    <div className="detail-item">
                      <span className="detail-label">Report Date:</span>
                      <span className="detail-value">
                        {new Date(eventReport.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="event-description">
                  {event.description ? (
                    <p>{event.description.length > 150 
                      ? `${event.description.substring(0, 150)}...` 
                      : event.description}
                    </p>
                  ) : (
                    <p className="no-description">No description available</p>
                  )}
                </div>
                
                <div className="event-actions">
                  {hasSubmittedReport ? (
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleViewReport(eventReport)}
                    >
                      View Report
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleCreateReport(event)}
                    >
                      Create Report
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <button
        className="btn btn-primary"
        onClick={() => setShowAddReportModal(true)}
      >
        Add Report
      </button>

      {/* Create Report Modal */}
      {showReportModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal report-modal">
            <div className="modal-header">
              <h2>Create Event Report</h2>
              <button 
                className="close-btn" 
                onClick={() => !isSubmitting && setShowReportModal(false)}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitReport} className="report-form">
              <div className="event-info-banner">
                <h3>{selectedEvent.eventName}</h3>
                <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="attendees">
                  Actual Attendees <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="attendees"
                  name="attendees"
                  value={reportForm.attendees}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="summary">
                  Event Summary <span className="required">*</span>
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={reportForm.summary}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Provide an overview of how the event went..."
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="achievements">Key Achievements</label>
                <textarea
                  id="achievements"
                  name="achievements"
                  value={reportForm.achievements}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List major achievements or milestones from this event..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="challenges">Challenges Faced</label>
                <textarea
                  id="challenges"
                  name="challenges"
                  value={reportForm.challenges}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe any challenges or issues encountered..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="feedback">Participant Feedback</label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={reportForm.feedback}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Share feedback received from participants..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Event Photos (Max 5MB per image)</label>
                
                <div className="photo-upload-container">
                  <label className="upload-button" htmlFor="photos">
                    <span className="upload-icon">+</span>
                    Upload Images
                  </label>
                  <input
                    type="file"
                    id="photos"
                    name="photos"
                    onChange={handlePhotoUpload}
                    accept="image/jpeg, image/png, image/gif"
                    multiple
                    className="hidden-input"
                  />
                  
                  <div className="upload-hint">
                    You can upload multiple images (JPEG, PNG, GIF)
                  </div>
                </div>
                
                {reportForm.photos.length > 0 && (
                  <div className="photo-preview-container">
                    {reportForm.photos.map((photo, index) => (
                      <div key={index} className="photo-preview">
                        <img src={photo.data} alt={`Preview ${index + 1}`} />
                        <button 
                          type="button" 
                          className="remove-photo-btn"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {isSubmitting && (
                <div className="upload-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
              
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReportModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Report Modal */}
      {showAddReportModal && (
        <div className="modal-overlay">
          <div className="modal add-report-modal">
            <div className="modal-header">
              <h2>Add New Report</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddReportModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddReportSubmit} className="add-report-form">
              <div className="form-group">
                <label htmlFor="eventId">Event <span className="required">*</span></label>
                <select
                  id="eventId"
                  name="eventId"
                  value={newReport.eventId}
                  onChange={(e) => setNewReport({ ...newReport, eventId: e.target.value })}
                  required
                >
                  <option value="">Select an event</option>
                  {completedEvents.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.eventName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="title">Title <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content <span className="required">*</span></label>
                <textarea
                  id="content"
                  name="content"
                  value={newReport.content}
                  onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="attendeeCount">Attendee Count <span className="required">*</span></label>
                <input
                  type="number"
                  id="attendeeCount"
                  name="attendeeCount"
                  value={newReport.attendeeCount}
                  onChange={(e) => setNewReport({ ...newReport, attendeeCount: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Attachments</label>
                <input
                  type="file"
                  onChange={handleAttachmentUpload}
                  multiple
                />
                <div className="attachments-list">
                  {newReport.attachments.map((attachment, index) => (
                    <div key={index} className="attachment-item">
                      <span>{attachment.name} ({attachment.size})</span>
                      <button
                        type="button"
                        className="remove-attachment-btn"
                        onClick={() => removeAttachment(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddReportModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewModal && selectedReport && (
        <div className="modal-overlay">
          <div className="modal report-view-modal">
            <div className="modal-header">
              <h2>Event Report</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="report-view-content">
              <div className="event-info-banner">
                <h3>{selectedReport.eventName}</h3>
                <div className="report-meta">
                  <span>Event Date: {selectedReport.eventDate ? new Date(selectedReport.eventDate).toLocaleDateString() : 'N/A'}</span>
                  <span>Report Submitted: {new Date(selectedReport.submissionDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="report-section">
                <h4>Event Summary</h4>
                <p>{selectedReport.summary}</p>
              </div>
              
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Attendees</span>
                  <span className="stat-value" style={{color: "black"} }>{selectedReport.attendeeCount}</span>
                </div>
                {selectedReport.rating !== null && (
                  <div className="stat-item">
                    <span className="stat-label">Admin Rating</span>
                    <span className="stat-value rating">
                      ★ {selectedReport.rating}
                    </span>
                  </div>
                )}
              </div>
              
              {selectedReport.achievements && (
                <div className="report-section">
                  <h4>Key Achievements</h4>
                  <p>{selectedReport.achievements}</p>
                </div>
              )}
              
              {selectedReport.challenges && (
                <div className="report-section">
                  <h4>Challenges Faced</h4>
                  <p>{selectedReport.challenges}</p>
                </div>
              )}
              
              {selectedReport.feedback && (
                <div className="report-section">
                  <h4>Participant Feedback</h4>
                  <p>{selectedReport.feedback}</p>
                </div>
              )}
              
              {selectedReport.photos && selectedReport.photos.length > 0 && (
                <div className="report-section">
                  <h4>Event Photos</h4>
                  <div className="report-photos">
                    {selectedReport.photos.map((photo, index) => (
                      <div key={index} className="report-photo">
                        <img 
                          src={photo.data || photo.url} 
                          alt={`Event photo ${index + 1}`} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
