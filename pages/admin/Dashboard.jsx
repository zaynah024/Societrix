import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/admin/Dashboard.css';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSocieties: 0,
    upcomingEvents: [],
    availableVenues: [],
    recentEvents: []
  });

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Simulating network delay
        
        // Mock data
        setDashboardData({
          totalSocieties: 4,
          upcomingEvents: [
            { id: 1, name: 'Tech Summit', date: '2023-07-15', society: 'ACM NUCES' },
            { id: 2, name: 'Annual Play', date: '2023-07-18', society: 'DramaF' },
            { id: 3, name: 'Physics Symposium', date: '2023-07-20', society: 'Physics Society' }
          ],
          availableVenues: [
            { id: 1, name: 'Main Auditorium', capacity: 500 },
            { id: 2, name: 'Conference Hall', capacity: 200 },
            { id: 3, name: 'Outdoor Amphitheater', capacity: 1000 }
          ],
          recentEvents: [
            { id: 1, name: 'FSPC', date: '2023-06-30', society: 'ACM NUCES', venue: 'Lab Complex' },
            { id: 2, name: 'Poetry Night', date: '2023-06-28', society: 'Literary Society', venue: 'Library Hall' },
            { id: 3, name: 'Science Exhibition', date: '2023-06-25', society: 'IEEE NUCES', venue: 'Exhibition Center' },
            { id: 4, name: 'Cultural Festival', date: '2023-06-20', society: 'Cultural Club', venue: 'Main Auditorium' }
          ]
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        
        <div className="stat-card available-venues">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>Available Venues</h3>
            <div className="stat-value">{dashboardData.availableVenues.length}</div>
            <Link to="/calendar" className="view-details">View details &rarr;</Link>
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
                {dashboardData.recentEvents.map(event => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{event.society}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="active-societies-section">
          <div className="section-header">
            <h2>Active</h2>
            <Link to="/societies" className="manage-all">Manage Societies</Link>
          </div>
          
          <div className="societies-list">
            {dashboardData.totalSocieties > 0 ? (
              <div className="society-cards">
                {/* This would be populated with actual society data */}
                <div className="society-card">
                  <h4>ACM NUCES</h4>
                  <p>Members: 45</p>
                  <p>Events: 12</p>
                </div>
                <div className="society-card">
                  <h4>DramaF</h4>
                  <p>Members: 32</p>
                  <p>Events: 8</p>
                </div>
                <div className="society-card">
                  <h4>SOFTEC</h4>
                  <p>Members: 128</p>
                  <p>Events: 5</p>
                </div>
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
