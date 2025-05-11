import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocieties } from '../../features/society/societySlice.mjs';
import { fetchEvents } from '../../features/events/EventSlice.mjs'; // Corrected import
import '../../styles/pages/admin/Dashboard.css';


const SocietyDashboard = () => {
  const dispatch = useDispatch();

  // Fetch societies and events from Redux store
  const { societies, status: societyStatus, error: societyError } = useSelector((state) => state.society);
  const { events, status: eventStatus, error: eventError } = useSelector((state) => state.events);

  const [dashboardData, setDashboardData] = useState({
    upcomingEvents: [],
    availableVenues: [],
    recentEvents: [],
  });

  useEffect(() => {
    dispatch(fetchSocieties());
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
  if (societyStatus === 'succeeded' && eventStatus === 'succeeded') {
    const currentDate = new Date();

    // Ensure events is an array before filtering
    const upcomingEvents = Array.isArray(events)
      ? events.filter(
          (event) => new Date(event.date) > currentDate && event.status === 'approved'
        )
      : [];

    const recentEvents = Array.isArray(events)
      ? events
          .filter((event) => event.status === 'completed')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4)
      : [];

    const venuesSet = new Set();
    if (Array.isArray(events)) {
      events.forEach((event) => {
        if (event.venue) venuesSet.add(event.venue);
      });
    }

    const availableVenues = Array.from(venuesSet).map((name, idx) => ({
      id: idx + 1,
      name,
      capacity: 'N/A', // Replace if your DB has capacity info
    }));

    setDashboardData({ upcomingEvents, availableVenues, recentEvents });
  }
}, [events, societies, societyStatus, eventStatus]);


  if (societyStatus === 'loading' || eventStatus === 'loading') {
    return (
      <div className="dashboard-loading">
        <h2>Loading dashboard data...</h2>
      </div>
    );
  }

  if (societyStatus === 'failed' || eventStatus === 'failed') {
    return (
      <div className="dashboard-error">
        <h2>Error loading data: {societyError || eventError}</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2>Welcome to Societrix - Your campus society management hub</h2>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card total-societies">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Societies</h3>
            <div className="stat-value">{societies.length}</div>
            <Link to="/societies" className="view-details">View details &rarr;</Link>
          </div>
        </div>

        <div className="stat-card upcoming-events">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Upcoming Events</h3>
            <div className="stat-value">{dashboardData.upcomingEvents.length}</div>
            <Link to="/calendar" className="view-details">View details &rarr;</Link>
          </div>
        </div>

      <div className="stat-card available-venues">
    <div className="stat-icon">🏟️</div>
    <div className="stat-content">
      <h3>Available Venues</h3>
      <div className="stat-value">{dashboardData.availableVenues.length}</div>
      <Link to="/venues" className="view-details">View details &rarr;</Link>
    </div>
  </div>
</div>


      

      <div className="dashboard-tables">
        <div className="recent-events-section">
          <div className="section-header">
            <h2>Recent Events</h2>
            <Link to="/calendar" className="view-all">View all</Link>
          </div>


          <table className="events-table">
            <thead>
              <tr>
                <th>EVENT</th>
                <th>SOCIETY</th>
                <th>DATE</th>
                <th>VENUE</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentEvents.length > 0 ? (
                dashboardData.recentEvents.map((event) => {
                  const society = societies.find((s) => s._id === event.societyId);
                  return (
                    <tr key={event._id}>
                      <td>{event.eventName}</td>
                      <td>{society?.name || 'Unknown'}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.venueId ? event.venueId.name : 'No venue'}</td> {/* Access venue name here */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">No recent events</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
};

export default SocietyDashboard;
