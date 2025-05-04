import { useState, useEffect } from 'react';
import '../../styles/pages/admin/EventRequests.css';

const EventRequests = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [budget, setBudget] = useState({ total: 100000, remaining: 75000 });
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionData, setRejectionData] = useState({ id: null, feedback: '' });
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    const fetchEventRequests = async () => {
      try {
        // Simulate API call
        
        // Mock data
        const mockEvents = [
          {
            id: 1,
            societyName: 'Computer Science Society',
            eventName: 'Annual Tech Summit',
            date: '2023-08-15',
            time: '10:00 AM - 5:00 PM',
            venue: 'Main Auditorium',
            budget: 5000,
            sponsorship: 2000,
            description: 'A full-day tech conference featuring industry speakers, workshops, and networking opportunities.',
            status: 'pending'
          },
          {
            id: 2,
            societyName: 'Drama Club',
            eventName: 'Summer Theater Production',
            date: '2023-07-22',
            time: '7:00 PM - 9:30 PM',
            venue: 'University Theater',
            budget: 8000,
            sponsorship: 3000,
            description: 'A theatrical performance of "A Midsummer Night\'s Dream" with student actors and production crew.',
            status: 'pending'
          },
          {
            id: 3,
            societyName: 'Business Society',
            eventName: 'Entrepreneurship Workshop',
            date: '2023-08-05',
            time: '2:00 PM - 6:00 PM',
            venue: 'Conference Hall B',
            budget: 3000,
            sponsorship: 1500,
            description: 'Workshop with successful entrepreneurs sharing their experiences and offering mentorship.',
            status: 'pending'
          }
        ];
        
        setEventRequests(mockEvents);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching event requests:', error);
        setIsLoading(false);
      }
    };

    fetchEventRequests();
  }, []);

  const handleApprove = (eventId) => {
    // Find the event
    const event = eventRequests.find(req => req.id === eventId);
    
    if (!event) return;
    
    // Calculate budget impact
    const budgetImpact = event.budget - event.sponsorship;
    const newRemaining = budget.remaining - budgetImpact;
    
    // Update budget
    setBudget({
      ...budget,
      remaining: newRemaining
    });
    
    // Update event status
    setEventRequests(prev => 
      prev.map(req => 
        req.id === eventId ? { ...req, status: 'approved' } : req
      )
    );
  };

  const openRejectionModal = (eventId) => {
    setRejectionData({ id: eventId, feedback: '' });
    setShowRejectionModal(true);
  };

  const handleReject = () => {
    if (!rejectionData.feedback.trim()) {
      alert('Please provide feedback for rejection');
      return;
    }
    
    // Update event status
    setEventRequests(prev => 
      prev.map(req => 
        req.id === rejectionData.id ? { ...req, status: 'rejected', rejectionFeedback: rejectionData.feedback } : req
      )
    );
    
    // Close modal and reset
    setShowRejectionModal(false);
    setRejectionData({ id: null, feedback: '' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return <div className="loading">Loading event requests...</div>;
  }

  return (
    <div className="event-requests-page">
      <div className="page-header">
        <h1>Event Requests</h1>
        <div className="budget-display">
          <div className="budget-item">
            <span>Total Budget:</span>
            <span className="budget-amount">{formatCurrency(budget.total)}</span>
          </div>
          <div className="budget-item">
            <span>Remaining:</span>
            <span className={`budget-amount ${budget.remaining < budget.total * 0.2 ? 'low-budget' : ''}`}>
              {formatCurrency(budget.remaining)}
            </span>
          </div>
        </div>
      </div>
      
      {eventRequests.length === 0 ? (
        <div className="no-requests">No event requests at the moment</div>
      ) : (
        <div className="event-requests-list">
          {eventRequests.map((event) => (
            <div 
              key={event.id} 
              className={`event-card ${event.status === 'approved' ? 'approved' : event.status === 'rejected' ? 'rejected' : ''}`}
            >
              <div className="event-header">
                <h3>{event.eventName}</h3>
                <span className={`status-badge ${event.status}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              
              <div className="society-name">{event.societyName}</div>
              
              <div className="event-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{event.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{event.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Venue:</span>
                  <span className="detail-value">{event.venue}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Budget:</span>
                  <span className="detail-value">{formatCurrency(event.budget)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sponsorship:</span>
                  <span className="detail-value">{formatCurrency(event.sponsorship)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Net Cost:</span>
                  <span className="detail-value highlight">
                    {formatCurrency(event.budget - event.sponsorship)}
                  </span>
                </div>
              </div>
              
              <div className="event-description">
                <h4>Description</h4>
                <p>{event.description}</p>
              </div>
              
              {event.status === 'pending' && (
                <div className="event-actions">
                  <button 
                    className="btn btn-approve"
                    onClick={() => handleApprove(event.id)}
                    disabled={event.budget - event.sponsorship > budget.remaining}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn btn-reject"
                    onClick={() => openRejectionModal(event.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
              
              {event.status === 'rejected' && event.rejectionFeedback && (
                <div className="rejection-feedback">
                  <h4>Rejection Feedback</h4>
                  <p>{event.rejectionFeedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reject Event Request</h2>
            <p>Please provide feedback for the rejection:</p>
            
            <textarea
              value={rejectionData.feedback}
              onChange={(e) => setRejectionData({ ...rejectionData, feedback: e.target.value })}
              placeholder="Enter feedback for the society..."
              rows="4"
              className="form-control"
            ></textarea>
            
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowRejectionModal(false)}>
                Cancel
              </button>
              <button className="btn btn-reject" onClick={handleReject}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequests;
