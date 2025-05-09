import React from "react";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarDays, formatMonthYear, isDateToday } from "../../lib/utils";
import EventForm from "../../components/EventForm";
import EventReportForm from "../../components/EventReportForm";
import "../../styles/pages/society/EventCalender.css"

const EventCalendar = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Generate calendar days for the selected month
  const calendarDays = getCalendarDays(selectedYear, selectedMonth);
  
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['/api/events'],
  });
  
  // Go to previous month
  const previousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  // Go to next month
  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  // Get events for the selected date
  const selectedDateEvents = events 
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
    : [];
  
  // Choose a day in the calendar
  const selectDay = (date) => {
    setSelectedDate(date);
  };
  
  // Handle opening the event form
  const handleRequestEvent = () => {
    setShowEventForm(true);
  };
  
  // Handle closing the event form
  const handleCloseEventForm = () => {
    setShowEventForm(false);
  };
  
  // Handle submitting an event report
  const handleSubmitReport = (event) => {
    setSelectedEvent(event);
    setShowReportForm(true);
  };
  
  // Handle closing the report form
  const handleCloseReportForm = () => {
    setShowReportForm(false);
    setSelectedEvent(null);
  };
  
  // Format the selected date for display
  const formattedSelectedDate = `${selectedDate.toLocaleString('default', { month: 'long' })} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
  
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Calendar</h1>
          <p className="page-description">View and manage upcoming society events</p>
        </div>
        
        <button className="btn-teal" onClick={handleRequestEvent}>
          <span className="plus-icon">+</span>
          Request New Event
        </button>
      </div>
      
      {showEventForm && (
        <div className="card mb-6">
          <EventForm onClose={handleCloseEventForm} />
        </div>
      )}
      
      {showReportForm && selectedEvent && (
        <div className="card mb-6">
          <EventReportForm event={selectedEvent} onClose={handleCloseReportForm} />
        </div>
      )}
      
      <div className="calendar-container">
        <div className="calendar-card">
          <div className="calendar-header">
            <button className="calendar-nav-button" onClick={previousMonth}>
              &lt;
            </button>
            
            <h2 className="calendar-title">{formatMonthYear(new Date(selectedYear, selectedMonth))}</h2>
            
            <button className="calendar-nav-button" onClick={nextMonth}>
              &gt;
            </button>
          </div>
          
          {/* Calendar days header */}
          <div className="calendar-weekdays">
            <div className="weekday">Su</div>
            <div className="weekday">Mo</div>
            <div className="weekday">Tu</div>
            <div className="weekday">We</div>
            <div className="weekday">Th</div>
            <div className="weekday">Fr</div>
            <div className="weekday">Sa</div>
          </div>
          
          {/* Calendar days grid */}
          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              const isSelected = day.date.toDateString() === selectedDate.toDateString();
              const isToday = isDateToday(day.date);
              
              // Check if there are events on this day
              const hasEvents = events ? events.some(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === day.date.toDateString();
              }) : false;
              
              return (
                <div 
                  key={index}
                  className={`day-cell ${!day.isCurrentMonth ? 'inactive' : ''} ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
                  onClick={() => day.isCurrentMonth && selectDay(day.date)}
                >
                  {day.date.getDate()}
                </div>
              );
            })}
          </div>
          
          <button className="request-event-button" onClick={handleRequestEvent}>
            Request New Event
          </button>
        </div>
        
        {/* Selected Day Events */}
        <div className="day-events-card">
          <h2 className="day-header">{formattedSelectedDate}</h2>
          
          {isLoadingEvents ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : selectedDateEvents.length > 0 ? (
            <div className="events-list">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="event-item">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-actions">
                    <span className={`event-status ${event.status}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    <div className="event-buttons">
                      <button className="event-action-btn">View Details</button>
                      {event.status === 'approved' && (
                        <button 
                          className="event-action-btn"
                          onClick={() => handleSubmitReport(event)}
                        >
                          Submit Report
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No events scheduled for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
