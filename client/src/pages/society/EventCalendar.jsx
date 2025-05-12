import { useState, useEffect, useMemo } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents, createEvent, getAllEvents } from '../../features/events/eventSlice.mjs';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../../styles/pages/society/EventCalendar.css";

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

const EventCalendar = () => {
  const dispatch = useDispatch();
  const { events: storeEvents, status: eventStatus } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const { societies } = useSelector((state) => state.society);
  
  const currentSociety = useMemo(() => {
    console.log("User data:", user);
    console.log("Societies data:", societies);
    
    if (!societies || !societies.length) {
      return null;
    }
    
    const society = societies.find(
      (s) => s._id === user?.societyId || s.email === user?.email
    );
    
    console.log("Found society:", society);
    return society;
  }, [user, societies]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    description: '',
    date: new Date(),
    time: '09:00',
    venue: '',
    budget: '',
    sponsorship: '',
    societyId: currentSociety?._id || ''
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);
  
  useEffect(() => {
    if (eventStatus === 'succeeded') {
      setIsLoading(false);
    }
  }, [eventStatus]);
  
  useEffect(() => {
    if (currentSociety?._id) {
      setNewEvent(prev => ({
        ...prev,
        societyId: currentSociety._id
      }));
      
      console.log("Updated societyId in form:", currentSociety._id);
    }
  }, [currentSociety]);
  
  const calendarEvents = useMemo(() => {
    if (!Array.isArray(storeEvents)) return [];
    
    return storeEvents.map(event => {
      try {
        const eventDate = new Date(event.date);
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
        
        const isOwnEvent = event.societyId === currentSociety?._id;
        
        return {
          id: event._id,
          title: event.eventName,
          start: startDate,
          end: endDate,
          venue: event.venue || 'To be determined',
          description: event.description || 'No description',
          status: event.status || 'pending',
          budget: event.budget || 0,
          sponsorship: event.sponsorship || 0,
          rejectReason: event.rejectReason || '',
          societyId: event.societyId,
          isOwnEvent,
          allDay: false
        };
      } catch (error) {
        console.error('Error formatting event:', error, event);
        return null;
      }
    }).filter(event => event !== null);
  }, [storeEvents, currentSociety]);
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const handleNewEvent = () => {
    setShowEventForm(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (e) => {
    const { value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      date: new Date(value)
    }));
  };
  
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!currentSociety?._id) {
      setFormError('Your society information could not be found. Please try reloading the page.');
      console.error("Missing societyId - currentSociety:", currentSociety);
      return;
    }
    
    if (!newEvent.eventName || !newEvent.description || !newEvent.venue || !newEvent.budget) {
      setFormError('Please fill in all required fields');
      return;
    }

    const eventToSubmit = {
      eventName: newEvent.eventName,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      venue: newEvent.venue,
      budget: Number(newEvent.budget) || 0,
      sponsorship: Number(newEvent.sponsorship) || 0,
      societyId: currentSociety._id,
      status: 'pending'
    };

    console.log('Submitting event:', JSON.stringify(eventToSubmit));
    
    dispatch(createEvent(eventToSubmit))
      .unwrap()
      .then(() => {
        dispatch(fetchEvents());
        
        setNewEvent({
          eventName: '',
          description: '',
          date: new Date(),
          time: '09:00',
          venue: '',
          budget: '',
          sponsorship: '',
          societyId: currentSociety?._id || ''
        });
        
        setShowEventForm(false);
      })
      .catch(err => {
        console.error("Error creating event:", err);
        setFormError(err.toString() || "Failed to create event. Please try again.");
      });
  };
  
  const handleCancelEventForm = () => {
    setShowEventForm(false);
  };
  
  const eventStyleGetter = (event) => {
    let backgroundColor;
    let textDecoration = 'none';
    let opacity = 0.9;
    let border = 'none';
    
    switch(event.status) {
      case 'approved':
        backgroundColor = '#3b82f6';
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
    
    if (event.isOwnEvent) {
      border = '2px solid #ffffff';
      opacity = 1;
    }
    
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity,
      color: 'white',
      border,
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
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading calendar...</p>
      </div>
    );
  }
  
  return (
    <div className="event-calendar-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Calendar</h1>
          <p className="page-description">Manage your society events and requests</p>
        </div>
        
        <button className="btn-primary new-event-btn" onClick={handleNewEvent}>
          <span className="plus-icon">+</span> Request New Event
        </button>
      </div>
      
      {showEventForm && (
        <div className="modal-overlay">
          <div className="modal event-form-modal">
            <div className="modal-header">
              <h2>Request New Event</h2>
              <button className="close-btn" onClick={handleCancelEventForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmitEvent} className="event-form">
              <div className="form-group">
                <label htmlFor="eventName">Event Name *</label>
                <input 
                  type="text" 
                  id="eventName" 
                  name="eventName" 
                  value={newEvent.eventName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eventDate">Date *</label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={newEvent.date.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="eventTime">Time *</label>
                  <input
                    type="time"
                    id="eventTime"
                    name="time"
                    value={newEvent.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="duration">Duration (hours) *</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    min="0.5"
                    step="0.5"
                    value={newEvent.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="venue">Preferred Venue *</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={newEvent.venue}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Hall, Lecture Theater, etc."
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="budget">Budget (PKR) *</label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={newEvent.budget}
                    onChange={handleInputChange}
                    placeholder="Estimated budget in PKR"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="sponsorship">Sponsorship (PKR)</label>
                  <input
                    type="number"
                    id="sponsorship"
                    name="sponsorship"
                    value={newEvent.sponsorship}
                    onChange={handleInputChange}
                    placeholder="Sponsorship amount in PKR"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe the event, its purpose, and any special requirements"
                  required
                ></textarea>
              </div>
              
              <div className="form-actions">
                {formError && <div className="form-error">{formError}</div>}
                <button type="button" className="btn-secondary" onClick={handleCancelEventForm}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
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
              setDate(newDate);
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
              setDate(newDate);
            }}
          >
            <span>❯</span>
          </button>
          
          <button 
            className="nav-btn today"
            onClick={() => setDate(new Date())}
          >
            Today
          </button>
        </div>
        
        <div className="view-controls">
          <button
            className={`view-btn ${view === 'month' ? 'active' : ''}`}
            onClick={() => setView('month')}
          >
            Month
          </button>
          <button
            className={`view-btn ${view === 'week' ? 'active' : ''}`}
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button
            className={`view-btn ${view === 'day' ? 'active' : ''}`}
            onClick={() => setView('day')}
          >
            Day
          </button>
        </div>
      </div>
      
      <div className="calendar-container">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={['month', 'week', 'day']}
          view={view}
          date={date}
          onView={setView}
          onNavigate={(newDate) => setDate(newDate)}
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
      
      <div className="event-status-info">
        <div className="status-legend">
          <p>Event Status:</p>
          <div className="status-item"><span className="status-dot pending"></span> Pending</div>
          <div className="status-item"><span className="status-dot approved"></span> Approved</div>
          <div className="status-item"><span className="status-dot rejected"></span> Rejected</div>
          <div className="status-item"><span className="status-dot completed"></span> Completed</div>
        </div>
        <div className="society-info">
          <p>Events with white border are from your society</p>
        </div>
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
                <div className="rejection-info">
                  <h3>Event Rejected</h3>
                  <p><strong>Reason:</strong> {selectedEvent.rejectReason}</p>
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowEventModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;