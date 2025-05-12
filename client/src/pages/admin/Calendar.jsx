import { useState, useEffect, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US'; 
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents, updateEventStatus } from '../../features/events/eventSlice.mjs';
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

// Function to generate random color for societies
const generateColorFromString = (str) => {
  if (!str) return '#6b7280'; // Default gray color
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const Calendar = () => {
  const dispatch = useDispatch();
  const { events: storeEvents, status } = useSelector(state => state.events);
  
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [eventColorCache, setEventColorCache] = useState({});

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      try {
        const eventsArray = Array.isArray(storeEvents) ? storeEvents : 
                           (storeEvents && typeof storeEvents === 'object' ? [storeEvents] : []);
        
        if (eventsArray.length === 0) {
          setIsLoading(false);
          return;
        }
        
        const formattedEvents = eventsArray.map(event => {
          try {
            const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
            
            if (isNaN(eventDate.getTime())) {
              console.error('Invalid date for event:', event);
              return null;
            }
            
            const timeString = event.time || "00:00";
            const [startHour, startMinute] = timeString.split(':').map(Number);
            
            const startDate = new Date(eventDate);
            startDate.setHours(startHour || 0, startMinute || 0);
            
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + 2);
            
            return {
              id: event._id,
              title: event.eventName,
              start: startDate,
              end: endDate,
              venue: event.venue || 'No venue specified',
              description: event.description || 'No description',
              status: event.status || 'pending',
              societyId: event.societyId || 'unknown',
              budget: event.budget || 0,
              rejectReason: event.rejectReason || ''
            };
          } catch (error) {
            console.error('Error formatting event:', error, event);
            return null;
          }
        }).filter(event => event !== null);
        
        setEvents(formattedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing events:', error);
        setIsLoading(false);
      }
    } else if (status === 'failed') {
      console.error('Failed to fetch events');
      setIsLoading(false);
    }
  }, [status, storeEvents]);

  useEffect(() => {
    const precomputedColors = {};
    events.forEach(event => {
      if (event.societyId && !precomputedColors[event.societyId]) {
        precomputedColors[event.societyId] = generateColorFromString(event.societyId);
      }
    });
    setEventColorCache(precomputedColors);
  }, [events]);

  const getColorForSociety = (societyId) => {
    return eventColorCache[societyId] || '#6b7280'; // Default gray color
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCancelEvent = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    dispatch(updateEventStatus({
      eventId: selectedEvent.id,
      statusData: {
        status: 'rejected',
        rejectReason: cancelReason
      }
    }));
    
    setShowCancelModal(false);
    setShowEventModal(false);
    setCancelReason('');
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    let textDecoration = 'none';
    let opacity = 0.9;
    
    switch(event.status) {
      case 'approved':
        backgroundColor = getColorForSociety(event.societyId);
        break;
      case 'rejected':
        backgroundColor = '#ef4444';
        textDecoration = 'line-through';
        opacity = 0.5;
        break;
      case 'completed':
        backgroundColor = '#10b981';
        break;
      case 'pending':
      default:
        backgroundColor = '#f59e0b';
        opacity = 0.7;
        break;
    }
    
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity,
      color: 'white',
      border: 'none',
      textDecoration,
      display: 'block',
      fontWeight: '500'
    };
    
    return { style };
  };

  const formats = {
    eventTimeRangeFormat: ({ start, end }) => {
      return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }
  };

  const calendarEvents = useMemo(() => {
    return events;
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
        {events.length === 0 && !isLoading && (
          <div className="no-events-warning">
            No events found. Please check your database or create new events.
          </div>
        )}
        <div className="calendar-controls">
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
                  <span className="info-label">Status:</span>
                  <span className={`info-value status-${selectedEvent.status}`}>{selectedEvent.status.toUpperCase()}</span>
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
                <div className="info-item">
                  <span className="info-label">Budget:</span>
                  <span className="info-value">PKR {selectedEvent.budget}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Description:</span>
                  <span className="info-value description">{selectedEvent.description}</span>
                </div>
              </div>
              
              {selectedEvent.status === 'rejected' && selectedEvent.rejectReason && (
                <div className="cancellation-info">
                  <h3>Event Rejected</h3>
                  <p><strong>Reason:</strong> {selectedEvent.rejectReason}</p>
                </div>
              )}
              
              <div className="modal-actions">
                {selectedEvent.status === 'pending' ? (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => {
                      setShowEventModal(false);
                      setShowCancelModal(true);
                    }}
                  >
                    Reject Event
                  </button>
                ) : (
                  selectedEvent.status === 'rejected' && (
                    <div className="rejected-badge">Event Rejected</div>
                  )
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
      
      {showCancelModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reject Event</h2>
            <p>Are you sure you want to reject "{selectedEvent.title}"?</p>
            
            <div className="form-group">
              <label htmlFor="cancelReason">Rejection Reason:</label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="form-control"
                rows="3"
                placeholder="Please provide a reason for rejection"
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
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
