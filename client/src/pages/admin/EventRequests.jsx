import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios"; // Import axios which was missing
import { getAllEvents, updateEventStatus } from "../../features/events/eventSlice.mjs";
import { fetchSocieties } from "../../features/society/societySlice.mjs";
import "../../styles/pages/admin/EventRequests.css";

const EventRequests = () => {
  const dispatch = useDispatch();

  // Get events from Redux store
  const { isLoading } = useSelector((state) => state.events);
  const eventsData = useSelector((state) => state.events?.events) || [];

  // Get societies from Redux store with proper state access
  const { societies, status: societiesStatus } = useSelector((state) => state.society);

  // Local state for UI management
  const [availableFunds, setAvailableFunds] = useState(75000);
  const [rejectionData, setRejectionData] = useState({
    id: null,
    feedback: "",
  });
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [additionalFunds, setAdditionalFunds] = useState(0);
  const [customApprovalData, setCustomApprovalData] = useState({
    id: null,
    amount: 0,
  });
  const [showCustomApprovalModal, setShowCustomApprovalModal] = useState(false);

  // Fetch events and societies on component mount
  useEffect(() => {
    dispatch(getAllEvents());
    dispatch(fetchSocieties());
  }, [dispatch]);

  // Build a map of societyId to name for quick lookup using the proper society state
  const societyNames = societies.reduce((acc, society) => {
    if (society && society._id) {
      acc[society._id] = society.name;
    }
    return acc;
  }, {});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Ensure events is always an array before filtering
  const pendingEvents = Array.isArray(eventsData)
    ? eventsData.filter((event) => event && event.status === "pending")
    : [];

  // Use eventsData instead of events for accessing individual events
  const findEvent = (eventId) => {
    return Array.isArray(eventsData)
      ? eventsData.find((event) => event && event._id === eventId)
      : null;
  };

  // Handle event approval with full budget
  const handleApprove = async (eventId) => {
  try {
    const event = findEvent(eventId);
    if (!event) return;

    const budgetImpact = event.budget - event.sponsorship;
    const newAvailable = availableFunds - budgetImpact;

    // Update event status using Redux action
    await dispatch(updateEventStatus({
      eventId: eventId,
      statusData: {
        status: "approved"
      }
    })).unwrap();

    // Update local state
    setAvailableFunds(newAvailable);
  } catch (error) {
    console.error("Error approving event:", error);
  }
};

  // Open custom approval modal
  const openCustomApprovalModal = (eventId) => {
    const event = findEvent(eventId);
    if (!event) return;

    const requestedAmount = event.budget - event.sponsorship;
    setCustomApprovalData({
      id: eventId,
      amount: requestedAmount,
      originalAmount: requestedAmount,
      maxAmount: Math.min(requestedAmount, availableFunds),
    });
    setShowCustomApprovalModal(true);
  };

  // Handle custom budget approval
const handleCustomApprove = async () => {
  try {
    const event = findEvent(customApprovalData.id);
    if (!event) return;

    if (customApprovalData.amount <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    if (customApprovalData.amount > availableFunds) {
      alert("The approved amount cannot exceed available funds.");
      return;
    }

    // Calculate the new approved budget (custom amount + sponsorship)
    const approvedBudget = customApprovalData.amount + event.sponsorship;

    // Update event using Redux action
    await dispatch(updateEventStatus({
      eventId: customApprovalData.id,
      statusData: {
        status: "approved",
        budget: approvedBudget
      }
    })).unwrap();

    // Update local state
    setAvailableFunds((prev) => prev - customApprovalData.amount);

    // Reset and close modal
    setShowCustomApprovalModal(false);
    setCustomApprovalData({ id: null, amount: 0 });
  } catch (error) {
    console.error("Error applying custom budget:", error);
  }
};

  // Open rejection modal
  const openRejectionModal = (eventId) => {
    setRejectionData({ id: eventId, feedback: "" });
    setShowRejectionModal(true);
  };

  // Handle event rejection
  const handleReject = async () => {
  try {
    if (!rejectionData.feedback.trim()) {
      alert("Please provide feedback for rejection");
      return;
    }

    // Update event status using Redux action
    await dispatch(updateEventStatus({
      eventId: rejectionData.id,
      statusData: {
        status: "rejected",
        rejectReason: rejectionData.feedback
      }
    })).unwrap();

    // Reset and close modal
    setShowRejectionModal(false);
    setRejectionData({ id: null, feedback: "" });
  } catch (error) {
    console.error("Error rejecting event:", error);
  }
};

  const handleBudgetUpdate = () => {
    if (isNaN(additionalFunds)) {
      alert("Please enter a valid number for additional funds");
      return;
    }

    const addFunds = parseFloat(additionalFunds);
    setAvailableFunds((prev) => prev + addFunds);

    setAdditionalFunds(0);
    setShowBudgetModal(false);
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
              <span
                className={`budget-amount ${
                  availableFunds < 20000 ? "low-budget" : ""
                }`}
              >
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

      {pendingEvents.length === 0 ? (
        <div className="no-requests">
          No pending event requests at the moment
        </div>
      ) : (
        <div className="event-requests-list">
          {pendingEvents.map((event) => (
            <div
              key={event._id}
              className={`event-card ${
                event.status === "approved"
                  ? "approved"
                  : event.status === "rejected"
                  ? "rejected"
                  : ""
              }`}
            >
              <div className="event-header">
                <h3>{event.eventName}</h3>
                <span className={`status-badge ${event.status}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>

              <div className="society-name">
                {societyNames[event.societyId] ||
                  (event.societyName ? event.societyName : "Unknown Society")}
              </div>

              <div className="event-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
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
                    {formatCurrency(event.budget)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sponsorship:</span>
                  <span className="detail-value">
                    {formatCurrency(event.sponsorship)}
                  </span>
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

              {event.status === "pending" && (
                <div className="event-actions">
                  <button
                    className="btn btn-approve"
                    onClick={() => handleApprove(event._id)}
                    disabled={event.budget - event.sponsorship > availableFunds}
                    title="Approve with full requested budget"
                  >
                    Approve Full
                  </button>
                  <button
                    className="btn btn-custom-approve"
                    onClick={() => openCustomApprovalModal(event._id)}
                    disabled={availableFunds <= 0}
                    title="Approve with a custom budget amount"
                  >
                    Custom Budget
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => openRejectionModal(event._id)}
                  >
                    Reject
                  </button>
                </div>
              )}

              {event.status === "rejected" && event.rejectReason && (
                <div className="rejection-feedback">
                  <h4>Rejection Feedback</h4>
                  <p>{event.rejectReason}</p>
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
              onChange={(e) =>
                setRejectionData({ ...rejectionData, feedback: e.target.value })
              }
              placeholder="Enter feedback for the society..."
              rows="4"
              className="form-control"
            ></textarea>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRejectionModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-reject" onClick={handleReject}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="modal-overlay">
          <div className="modal budget-modal">
            <h2>Manage Available Funds</h2>

            <div className="budget-form">
              <div className="budget-summary">
                <div className="budget-info">
                  <span>Current Available Funds:</span>
                  <span className="budget-value">
                    {formatCurrency(availableFunds)}
                  </span>
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
                      onClick={() =>
                        setAdditionalFunds(
                          (prev) => parseFloat(prev || 0) + 1000
                        )
                      }
                    >
                      ▲
                    </button>
                    <button
                      className="number-down"
                      onClick={() =>
                        setAdditionalFunds((prev) =>
                          Math.max(0, parseFloat(prev || 0) - 1000)
                        )
                      }
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
                      {formatCurrency(
                        availableFunds + parseFloat(additionalFunds || 0)
                      )}
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
              <button className="btn btn-primary" onClick={handleBudgetUpdate}>
                Update Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Approval Modal */}
      {showCustomApprovalModal && (
        <div className="modal-overlay">
          <div className="modal custom-approval-modal">
            <h2>Custom Budget Approval</h2>

            <div className="budget-form">
              <div className="budget-summary">
                <div className="budget-info">
                  <span>Requested Budget:</span>
                  <span className="budget-value">
                    {formatCurrency(customApprovalData.originalAmount)}
                  </span>
                </div>
                <div className="budget-info">
                  <span>Available Funds:</span>
                  <span className="budget-value">
                    {formatCurrency(availableFunds)}
                  </span>
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
                    onChange={(e) =>
                      setCustomApprovalData((prev) => ({
                        ...prev,
                        amount: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="form-control"
                    placeholder="Enter approved amount..."
                  />
                  <div className="number-controls">
                    <button
                      className="number-up"
                      onClick={() =>
                        setCustomApprovalData((prev) => ({
                          ...prev,
                          amount: Math.min(prev.maxAmount, prev.amount + 500),
                        }))
                      }
                    >
                      ▲
                    </button>
                    <button
                      className="number-down"
                      onClick={() =>
                        setCustomApprovalData((prev) => ({
                          ...prev,
                          amount: Math.max(0, prev.amount - 500),
                        }))
                      }
                    >
                      ▼
                    </button>
                  </div>
                </div>
                {customApprovalData.amount > availableFunds && (
                  <div className="error-message">
                    Amount exceeds available funds
                  </div>
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
                disabled={
                  customApprovalData.amount <= 0 ||
                  customApprovalData.amount > availableFunds
                }
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
