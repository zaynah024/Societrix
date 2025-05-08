import React from "react";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarDays, formatMonthYear, isDateToday, formatDate, getStatusBadgeClass } from '../lib/utils';
import EventForm from '../components/EventForm';
import EventReportForm from '../components/EventReportForm';

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
  
  return (
    <div>
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Event Calendar</h1>
          <p className="page-description">View and manage upcoming society events</p>
        </div>
        
        <button className="btn btn-primary mt-4 md:mt-0" onClick={handleRequestEvent}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
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
      
      <div className="calendar-layout">
        {/* Calendar Widget */}
        <div className="card">
          <div className="calendar-header">
            <button className="calendar-nav-button" onClick={previousMonth}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <h2 className="calendar-title">{formatMonthYear(new Date(selectedYear, selectedMonth))}</h2>
            
            <button className="calendar-nav-button" onClick={nextMonth}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Calendar days header */}
          <div className="calendar-days">
            <div className="calendar-weekday">Su</div>
            <div className="calendar-weekday">Mo</div>
            <div className="calendar-weekday">Tu</div>
            <div className="calendar-weekday">We</div>
            <div className="calendar-weekday">Th</div>
            <div className="calendar-weekday">Fr</div>
            <div className="calendar-weekday">Sa</div>
          </div>
          
          {/* Calendar days grid */}
          <div className="calendar-days">
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
                  className={`calendar-day ${!day.isCurrentMonth ? 'inactive' : ''} ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
                  onClick={() => day.isCurrentMonth && selectDay(day.date)}
                >
                  {day.date.getDate()}
                  {hasEvents && <span className="event-indicator"></span>}
                </div>
              );
            })}
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <button className="btn btn-primary btn-block" onClick={handleRequestEvent}>
              Request New Event
            </button>
          </div>
        </div>
        
        {/* Selected Day Events */}
        <div className="card">
          <h2 className="text-lg font-medium mb-6">{formatDate(selectedDate)}</h2>
          
          {isLoadingEvents ? (
            <div className="loading-screen" style={{ height: '160px' }}>
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{event.description}</p>
                  <div className="mt-2 flex justify-between">
                    <span className={getStatusBadgeClass(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-primary text-sm">View Details</button>
                      {event.status === 'approved' && (
                        <button 
                          className="text-primary text-sm ml-3"
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
            <div className="flex items-center justify-center h-40 text-gray-500">
              <p>No events scheduled for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
