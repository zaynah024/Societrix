import { useState, useEffect, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/pages/admin/Calendar.css';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const eventColors = {
  'Computer Science Society': '#3b82f6', // Blue
  'Drama Club': '#8b5cf6',               // Purple
  'Business Society': '#10b981',         // Green
  'Photography Club': '#ef4444',         // Red
  'default': '#6b7280'                   // Grey
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Simulate API call
        
        // Mock data
        const today = new Date();
        const mockEvents = [
          {
            id: 1,
            title: 'Tech Summit',
            society: 'Computer Science Society',
            start: new Date(2023, 6, 15, 10, 0),
            end: new Date(2023, 6, 15, 17, 0),
            venue: 'Main Auditorium',
            description: 'Annual technology conference featuring industry speakers and workshops',
            isApproved: true
          },
          {
            id: 2,
            title: 'Summer Theater Production',
            society: 'Drama Club',
            start: new Date(2023, 6, 22, 19, 0),
            end: new Date(2023, 6, 22, 21, 30),
            venue: 'University Theater',
            description: 'A theatrical performance of "A Midsummer Night\'s Dream"',
            isApproved: true
          },
          {
            id: 3,
            title: 'Entrepreneurship Workshop',
            society: 'Business Society',
            start: new Date(2023, 7, 5, 14, 0),
            end: new Date(2023, 7, 5, 18, 0),
            venue: 'Conference Hall B',
            description: 'Workshop with successful entrepreneurs sharing their experiences',
            isApproved: true
          },
          // Add events for today
          {
            id: 4,
            title: 'Photography Exhibition',
            society: 'Photography Club',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
            venue: 'Art Gallery',
            description: 'Photography exhibition showcasing student work',
            isApproved: true
          },
          // Add events for yesterday and tomorrow for testing
          {
            id: 5,
            title: 'Code Workshop',
            society: 'Computer Science Society',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 14, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 16, 0),
            venue: 'Lab Complex',
            description: 'Hands-on coding workshop for beginners',
            isApproved: true
          },
          {
            id: 6,
            title: 'Drama Rehearsal',
            society: 'Drama Club',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 18, 0),
            venue: 'Drama Studio',
            description: 'Rehearsal for upcoming performance',
            isApproved: true
          }
        ];
        
        setEvents(mockEvents);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCancelEvent = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setEvents(prev => 
      prev.map(e => 
        e.id === selectedEvent.id ? { ...e, isApproved: false, cancelReason } : e
      )
    );
    
    setShowCancelModal(false);
    setShowEventModal(false);
    setCancelReason('');
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.isApproved 
      ? (eventColors[event.society] || eventColors.default)
      : '#9ca3af'; 
    
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: event.isApproved ? 0.9 : 0.5,
      color: 'white',
      border: 'none',
      textDecoration: event.isApproved ? 'none' : 'line-through',
      display: 'block',
      fontWeight: '500'
    };
    
    return {
      style
    };
  };

  // Configure calendar formats
  const formats = {
    eventTimeRangeFormat: ({ start, end }) => {
      return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }
  };

  // Memoize calendar events for better performance
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      title: `${event.title} (${event.society})` 
    }));
  }, [events]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (date) => {
    setDate(date);
  };

  if (isLoading) {
    return <div className="loading">Loading calendar...</div>;
  }

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Event Calendar</h1>
        <div className="calendar-controls">
          {/* Add navigation controls */}
          <div className="navigation-controls">
            <button 
              className="nav-btn prev"
              onClick={() => {
                const newDate = new Date(date);
                if (view === 'month') {
                  newDate.setMonth(date.getMonth() - 1);
                } else if (view === 'week') {
                  newDate.setDate(date.getDate() - 7);
                } else {
                  newDate.setDate(date.getDate() - 1);
                }
                handleNavigate(newDate);
              }}
            >
              <span>❮</span>
            </button>
            
            <span className="current-date">
              {view === 'month' 
                ? format(date, 'MMMM yyyy')
                : view === 'week'
                ? `${format(new Date(date.setDate(date.getDate() - date.getDay())), 'MMM d')} - ${format(new Date(date.setDate(date.getDate() - date.getDay() + 6)), 'MMM d, yyyy')}`
                : format(date, 'MMMM d, yyyy')
              }
            </span>
            
            <button 
              className="nav-btn next"
              onClick={() => {
                const newDate = new Date(date);
                if (view === 'month') {
                  newDate.setMonth(date.getMonth() + 1);
                } else if (view === 'week') {
                  newDate.setDate(date.getDate() + 7);
                } else {
                  newDate.setDate(date.getDate() + 1);
                }
                handleNavigate(newDate);
              }}
            >
              <span>❯</span>
            </button>
            
            <button 
              className="nav-btn today"
              onClick={() => handleNavigate(new Date())}
            >
              Today
            </button>
          </div>
          
          <div className="view-controls">
            <button
              className={`view-btn ${view === 'month' ? 'active' : ''}`}
              onClick={() => handleViewChange('month')}
            >
              Month
            </button>
            <button
              className={`view-btn ${view === 'week' ? 'active' : ''}`}
              onClick={() => handleViewChange('week')}
            >
              Week
            </button>
            <button
              className={`view-btn ${view === 'day' ? 'active' : ''}`}
              onClick={() => handleViewChange('day')}
            >
              Day
            </button>
          </div>
        </div>
      </div>
      
      <div className="big-calendar-container">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={['month', 'week', 'day']}
          view={view}
          date={date}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter}
          formats={{
            ...formats,
            monthHeaderFormat: (date) => format(date, 'MMMM yyyy'),
            dayHeaderFormat: (date) => format(date, 'EEEE, MMMM d, yyyy'),
            dayRangeHeaderFormat: ({ start, end }) => `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
          }}
          toolbar={false} 
          popup
          className="custom-calendar"
        />
      </div>
      
      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal event-modal">
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <button className="close-btn" onClick={() => setShowEventModal(false)}>×</button>
            </div>
            
            <div className="event-modal-content">
              <div className="event-info-grid">
                <div className="info-item">
                  <span className="info-label">Society:</span>
                  <span className="info-value">{selectedEvent.society}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date:</span>
                  <span className="info-value">
                    {format(selectedEvent.start, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time:</span>
                  <span className="info-value">
                    {format(selectedEvent.start, 'h:mm a')} - {format(selectedEvent.end, 'h:mm a')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Venue:</span>
                  <span className="info-value">{selectedEvent.venue}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Description:</span>
                  <span className="info-value description">{selectedEvent.description}</span>
                </div>
              </div>
              
              {!selectedEvent.isApproved && selectedEvent.cancelReason && (
                <div className="cancellation-info">
                  <h3>Event Cancelled</h3>
                  <p><strong>Reason:</strong> {selectedEvent.cancelReason}</p>
                </div>
              )}
              
              <div className="modal-actions">
                {selectedEvent.isApproved ? (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => {
                      setShowEventModal(false);
                      setShowCancelModal(true);
                    }}
                  >
                    Cancel Event
                  </button>
                ) : (
                  <div className="cancelled-badge">Event Cancelled</div>
                )}
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowEventModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel Event Modal */}
      {showCancelModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Cancel Event</h2>
            <p>Are you sure you want to cancel "{selectedEvent.title}"?</p>
            
            <div className="form-group">
              <label htmlFor="cancelReason">Reason for Cancellation:</label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="form-control"
                rows="3"
                placeholder="Please provide a reason for cancellation"
                required
              ></textarea>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCancelModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleCancelEvent}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
