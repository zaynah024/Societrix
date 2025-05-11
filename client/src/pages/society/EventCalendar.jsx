import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCalendarDays, formatMonthYear, isDateToday } from "../../lib/utils";
import EventForm from "../../components/society/EventForm";
import EventReportForm from "../../components/society/EventReportForm";
import axios from "axios";
import "../../styles/pages/society/EventCalender.css";

const API_URL = 'http://localhost:5000/api';

const EventCalendar = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const queryClient = useQueryClient();

  // Fetch events
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/events`);
      return res.data;
    },
  });

  // Fetch societies
  const { data: societies } = useQuery({
    queryKey: ['societies'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/societies`);
      return res.data;
    },
  });

  // Fetch venues
  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/venues`);
      return res.data;
    },
  });

  // Mutation to create a new event
  const createEventMutation = useMutation({
    mutationFn: async (newEvent) => {
      const res = await axios.post(`${API_URL}/events`, newEvent, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']); // Refresh events after adding a new one
      setShowEventForm(false);
    },
  });

  // Generate calendar days for the selected month
  const calendarDays = getCalendarDays(selectedYear, selectedMonth);

  // Get events for the selected date
  const selectedDateEvents = events
    ? events.filter((event) => {
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
          <EventForm
            onClose={handleCloseEventForm}
            onSubmit={(newEvent) => createEventMutation.mutate(newEvent)}
            societies={societies || []}
            venues={venues || []}
          />
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
            <button className="calendar-nav-button" onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))}>
              &lt;
            </button>

            <h2 className="calendar-title">{formatMonthYear(new Date(selectedYear, selectedMonth))}</h2>

            <button className="calendar-nav-button" onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))}>
              &gt;
            </button>
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              const isSelected = day.date.toDateString() === selectedDate.toDateString();
              const isToday = isDateToday(day.date);

              const hasEvents = events
                ? events.some((event) => {
                    const eventDate = new Date(event.date);
                    return eventDate.toDateString() === day.date.toDateString();
                  })
                : false;

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
        </div>

        <div className="day-events-card">
          <h2>Events on {formattedSelectedDate}</h2>

          {isLoadingEvents ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : selectedDateEvents.length > 0 ? (
            <div className="events-list">
              {selectedDateEvents.map((event) => (
                <div key={event._id}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
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