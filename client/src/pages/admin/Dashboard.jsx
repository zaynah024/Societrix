import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocieties } from '../../features/society/societySlice.mjs';
import { getAllEvents } from '../../features/events/eventSlice.mjs';
import '../../styles/pages/admin/Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get data from Redux store
  const { societies } = useSelector((state) => state.society);
  const { events } = useSelector((state) => state.events);
  
  const [dashboardData, setDashboardData] = useState({
    totalSocieties: 0,
    upcomingEvents: [],
    completedEvents: 0,
    recentEvents: [],
    topSocieties: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real data from backend
        await dispatch(fetchSocieties());
        await dispatch(getAllEvents());
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);
  
  useEffect(() => {
    if (!isLoading) {
      // Current date for filtering events
      const currentDate = new Date();
      
      // Filter upcoming approved events (future date + approved status)
      const upcomingEvents = events.filter(event => 
        new Date(event.date) > currentDate && 
        event.status === 'approved'
      );
      
      // Filter completed events (past events with completed status)
      const recentCompletedEvents = events
        .filter(event => event.status === 'completed')
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending (newest first)
        .slice(0, 6); // Only get the 6 most recent ones
      
      // Count events per society (both approved and completed)
      const societyEventCounts = events
        .filter(event => event.status === 'approved' || event.status === 'completed')
        .reduce((counts, event) => {
          const id = event.societyId;
          counts[id] = (counts[id] || 0) + 1;
          return counts;
        }, {});
      
      // Sort societies by event count (descending) and get top 4
      const topSocietiesByEventCount = Object.entries(societyEventCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by count (highest first)
        .slice(0, 4) // Get top 4 instead of top 3
        .map(([societyId, count]) => {
          const society = societies.find(s => s._id === societyId);
          return society ? { ...society, eventCount: count } : null;
        })
        .filter(society => society !== null);
      
      // Count completed events
      const completedEventsCount = events.filter(event => event.status === 'completed').length;

      setDashboardData({
        totalSocieties: societies.length,
        upcomingEvents: upcomingEvents,
        completedEvents: completedEventsCount,
        recentEvents: recentCompletedEvents,
        topSocieties: topSocietiesByEventCount
      });
    }
  }, [isLoading, societies, events]);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading dashboard data...</h2>
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
            <div className="stat-value">{dashboardData.totalSocieties}</div>
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
        
        <div className="stat-card completed-events">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Events</h3>
            <div className="stat-value">{dashboardData.completedEvents}</div>
            <Link to="/reports" className="view-details">View details &rarr;</Link>
          </div>
        </div>
      </div>
      
      <div className="dashboard-tables">
        <div className="recent-events-section">
          <div className="section-header">
            <h2>Recent Events</h2>
            <Link to="/calendar" className="view-all">View all</Link>
          </div>
          
          <div className="table-responsive">
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
                  dashboardData.recentEvents.map(event => {
                    // Find the society name corresponding to the event's societyId
                    const societyName = societies.find(s => s._id === event.societyId)?.name || 'Unknown Society';
                    
                    return (
                      <tr key={event._id}>
                        <td>{event.eventName}</td>
                        <td>{societyName}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.venue}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">No recent events found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="active-societies-section">
          <div className="section-header">
            <h2>Active Societies</h2>
            <Link to="/societies" className="manage-all">Manage Societies</Link>
          </div>
          
          <div className="societies-list">
            {dashboardData.topSocieties && dashboardData.topSocieties.length > 0 ? (
              <div className="society-cards">
                {dashboardData.topSocieties.map(society => (
                  <div className="society-card" key={society._id}>
                    <h4>{society.name}</h4>
                    <p>Members: {society.members ? society.members.length : 0}</p>
                    <p>Events: {society.eventCount || 0}</p>
                    <p>Rating: {society.rating?.toFixed(1) || 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No active societies found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
