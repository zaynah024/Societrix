import { useState, useEffect } from 'react';
import '../../styles/pages/admin/EventRequests.css';

const EventRequests = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [availableFunds, setAvailableFunds] = useState(75000);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionData, setRejectionData] = useState({ id: null, feedback: '' });
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [additionalFunds, setAdditionalFunds] = useState(0);
  const [customApprovalData, setCustomApprovalData] = useState({ id: null, amount: 0 });
  const [showCustomApprovalModal, setShowCustomApprovalModal] = useState(false);

  useEffect(() => {
    const fetchEventRequests = async () => {
      try {
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
    const event = eventRequests.find(req => req.id === eventId);
    
    if (!event) return;
    
    const budgetImpact = event.budget - event.sponsorship;
    const newAvailable = availableFunds - budgetImpact;
    
    setAvailableFunds(newAvailable);
    
    setEventRequests(prev => 
      prev.map(req => 
        req.id === eventId ? { ...req, status: 'approved' } : req
      )
    );
  };

  const openCustomApprovalModal = (eventId) => {
    const event = eventRequests.find(req => req.id === eventId);
    if (!event) return;
    
    const requestedAmount = event.budget - event.sponsorship;
    setCustomApprovalData({ 
      id: eventId, 
      amount: requestedAmount,
      originalAmount: requestedAmount,
      maxAmount: Math.min(requestedAmount, availableFunds)
    });
    setShowCustomApprovalModal(true);
  };

  const handleCustomApprove = () => {
    const event = eventRequests.find(req => req.id === customApprovalData.id);
    if (!event) return;
    
    if (customApprovalData.amount <= 0) {
      alert('Please enter a valid budget amount.');
      return;
    }
    
    if (customApprovalData.amount > availableFunds) {
      alert('The approved amount cannot exceed available funds.');
      return;
    }
    
    setAvailableFunds(prev => prev - customApprovalData.amount);
    
    setEventRequests(prev => 
      prev.map(req => 
        req.id === customApprovalData.id ? { 
          ...req, 
          status: 'approved', 
          approvedBudget: customApprovalData.amount + req.sponsorship 
        } : req
      )
    );
    
    setShowCustomApprovalModal(false);
    setCustomApprovalData({ id: null, amount: 0 });
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
    
    setEventRequests(prev => 
      prev.map(req => 
        req.id === rejectionData.id ? { ...req, status: 'rejected', rejectionFeedback: rejectionData.feedback } : req
      )
    );
    
    setShowRejectionModal(false);
    setRejectionData({ id: null, feedback: '' });
  };

  const handleBudgetUpdate = () => {
    if (isNaN(additionalFunds)) {
      alert('Please enter a valid number for additional funds');
      return;
    }

    const addFunds = parseFloat(additionalFunds);
    setAvailableFunds(prev => prev + addFunds);
    
    setAdditionalFunds(0);
    setShowBudgetModal(false);
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
        <div className="budget-section">
          <div className="budget-display">
            <div className="budget-item">
              <span>Available Funds:</span>
              <span className={`budget-amount ${availableFunds < 20000 ? 'low-budget' : ''}`}>
                {formatCurrency(availableFunds)}
              </span>
            </div>
          </div>
          <button 
            className="budget-edit-btn"
            onClick={() => {
              setAdditionalFunds(0);
              setShowBudgetModal(true);
            }}
          >
            <i className="fas fa-edit"></i> Manage Funds
          </button>
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
                  <span className="detail-value">
                    {event.status === 'approved' && event.approvedBudget ? 
                      `${formatCurrency(event.approvedBudget)} (Approved)` : 
                      formatCurrency(event.budget)}
                  </span>
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
                    disabled={event.budget - event.sponsorship > availableFunds}
                    title="Approve with full requested budget"
                  >
                    Approve Full
                  </button>
                  <button 
                    className="btn btn-custom-approve"
                    onClick={() => openCustomApprovalModal(event.id)}
                    disabled={availableFunds <= 0}
                    title="Approve with a custom budget amount"
                  >
                    Custom Budget
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
      
      {showBudgetModal && (
        <div className="modal-overlay">
          <div className="modal budget-modal">
            <h2>Manage Available Funds</h2>
            
            <div className="budget-form">
              <div className="budget-summary">
                <div className="budget-info">
                  <span>Current Available Funds:</span>
                  <span className="budget-value">{formatCurrency(availableFunds)}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Add Funds:</label>
                <div className="custom-number-input">
                  <input 
                    type="number" 
                    value={additionalFunds}
                    onChange={(e) => setAdditionalFunds(e.target.value)}
                    className="form-control"
                    placeholder="Enter amount..."
                  />
                  <div className="number-controls">
                    <button 
                      className="number-up" 
                      onClick={() => setAdditionalFunds(prev => parseFloat(prev || 0) + 1000)}
                    >
                      ▲
                    </button>
                    <button 
                      className="number-down" 
                      onClick={() => setAdditionalFunds(prev => Math.max(0, parseFloat(prev || 0) - 1000))}
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>After Adding Funds:</label>
                <div className="budget-preview">
                  <div className="preview-item">
                    <span>New Available Amount:</span>
                    <span className="preview-value highlight-value">
                      {formatCurrency(availableFunds + parseFloat(additionalFunds || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowBudgetModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleBudgetUpdate}
              >
                Update Funds
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showCustomApprovalModal && (
        <div className="modal-overlay">
          <div className="modal custom-approval-modal">
            <h2>Custom Budget Approval</h2>
            
            <div className="budget-form">
              <div className="budget-summary">
                <div className="budget-info">
                  <span>Requested Budget:</span>
                  <span className="budget-value">{formatCurrency(customApprovalData.originalAmount)}</span>
                </div>
                <div className="budget-info">
                  <span>Available Funds:</span>
                  <span className="budget-value">{formatCurrency(availableFunds)}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Approved Budget Amount:</label>
                <div className="custom-number-input">
                  <input 
                    type="number"
                    min="0"
                    max={customApprovalData.maxAmount}
                    value={customApprovalData.amount}
                    onChange={(e) => setCustomApprovalData(prev => ({ 
                      ...prev, 
                      amount: parseFloat(e.target.value) || 0 
                    }))}
                    className="form-control"
                    placeholder="Enter approved amount..."
                  />
                  <div className="number-controls">
                    <button 
                      className="number-up" 
                      onClick={() => setCustomApprovalData(prev => ({ 
                        ...prev, 
                        amount: Math.min(prev.maxAmount, prev.amount + 500) 
                      }))}
                    >
                      ▲
                    </button>
                    <button 
                      className="number-down" 
                      onClick={() => setCustomApprovalData(prev => ({ 
                        ...prev, 
                        amount: Math.max(0, prev.amount - 500) 
                      }))}
                    >
                      ▼
                    </button>
                  </div>
                </div>
                {customApprovalData.amount > availableFunds && (
                  <div className="error-message">Amount exceeds available funds</div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCustomApprovalModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-approve" 
                onClick={handleCustomApprove}
                disabled={customApprovalData.amount <= 0 || customApprovalData.amount > availableFunds}
              >
                Approve with Custom Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequests;
