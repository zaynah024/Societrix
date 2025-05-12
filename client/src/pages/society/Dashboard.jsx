import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocieties } from '../../features/society/societySlice.mjs';
import { fetchEvents } from '../../features/events/eventSlice.mjs';
import '../../styles/pages/society/Dashboard.css';

const SocietyDashboard = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Get society info and events from Redux store
  const { societies, status: societyStatus, error: societyError } = useSelector((state) => state.society);
  const { events, status: eventStatus, error: eventError } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  const [dashboardData, setDashboardData] = useState({
    societyDetails: null,
    upcomingEvents: [],
    completedEvents: 0,
    pendingEvents: 0,
    recentEvents: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await dispatch(fetchSocieties());
        await dispatch(fetchEvents());
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  useEffect(() => {
    if (societyStatus === 'succeeded' && eventStatus === 'succeeded') {
      // Find current society based on logged in user
      const currentSociety = societies.find(
        (society) => society._id === user?.societyId || society.email === user?.email
      );

      // Current date for filtering events
      const currentDate = new Date();
      
      // Filter society-specific events
      const societyEvents = Array.isArray(events) 
        ? events.filter(event => event.societyId === currentSociety?._id)
        : [];
      
      // Filter upcoming events for this society
      const upcomingEvents = societyEvents.filter(
        event => new Date(event.date) > currentDate && event.status === 'approved'
      );
      
      // Count completed events for this society
      const completedEvents = societyEvents.filter(
        event => event.status === 'completed'
      ).length;

      // Count pending events for this society
      const pendingEvents = societyEvents.filter(
        event => event.status === 'pending'
      ).length;
      
      // Get recent events for this society
      const recentEvents = societyEvents
        .filter(event => event.status === 'completed')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

      setDashboardData({
        societyDetails: currentSociety || null,
        upcomingEvents,
        completedEvents,
        pendingEvents,
        recentEvents,
      });
    }
  }, [events, societies, societyStatus, eventStatus, user]);

  if (isLoading || societyStatus === 'loading' || eventStatus === 'loading') {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
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
        <h2>Welcome to {dashboardData.societyDetails?.name || 'Society'} Dashboard</h2>
        <p>Manage your society activities and events</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card upcoming-events">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Upcoming Events</h3>
            <div className="stat-value">{dashboardData.upcomingEvents.length}</div>
          </div>
        </div>

        <div className="stat-card completed-events">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed Events</h3>
            <div className="stat-value">{dashboardData.completedEvents}</div>
          </div>
        </div>

        <div className="stat-card pending-events">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Approvals</h3>
            <div className="stat-value">{dashboardData.pendingEvents}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-table-full">
        <div className="recent-events-section">
          <div className="section-header">
            <h2>Recent Events</h2>
          </div>

          <div className="table-responsive">
            <table className="events-table">
              <thead>
                <tr>
                  <th>EVENT</th>
                  <th>DATE</th>
                  <th>VENUE</th>
                  <th>ATTENDEES</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentEvents.length > 0 ? (
                  dashboardData.recentEvents.map((event) => (
                    <tr key={event._id}>
                      <td>{event.eventName}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.venue || 'N/A'}</td>
                      <td>{event.attendees || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">No recent events</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocietyDashboard;
