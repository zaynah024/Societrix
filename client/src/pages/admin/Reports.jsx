import { useState, useEffect } from 'react';
import '../../styles/pages/admin/Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unrated', 'rated'
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Simulate API call
        
        // Mock data
        const mockReports = [
          {
            id: 1,
            society: 'Computer Science Society',
            eventName: 'Tech Summit',
            eventDate: '2023-06-15',
            submissionDate: '2023-06-18',
            title: 'Annual Tech Summit Report',
            content: 'The Tech Summit was a great success with over 200 attendees. We had 5 speakers from leading tech companies who shared their insights. The workshops were particularly well-received, with positive feedback from participants. We managed to stay within budget and even secured additional sponsorship on the day of the event.',
            attachments: [
              { name: 'tech_summit_photos.zip', size: '15.2 MB' },
              { name: 'attendee_feedback.pdf', size: '420 KB' }
            ],
            attendeeCount: 210,
            rating: 4
          },
          {
            id: 2,
            society: 'Drama Club',
            eventName: 'Summer Theater Production',
            eventDate: '2023-06-22',
            submissionDate: '2023-06-25',
            title: 'A Midsummer Night\'s Dream - Post-Event Report',
            content: 'Our production of "A Midsummer Night\'s Dream" ran for three nights with an average attendance of 85 people per night. The audience feedback was overwhelmingly positive. We faced some technical challenges on the first night with lighting, but quickly resolved them for the remaining performances. The costume and set design received special praise from the faculty advisor.',
            attachments: [
              { name: 'performance_photos.jpg', size: '8.5 MB' },
              { name: 'production_budget_final.xlsx', size: '180 KB' }
            ],
            attendeeCount: 255,
            rating: 5
          },
          {
            id: 3,
            society: 'Business Society',
            eventName: 'Entrepreneurship Workshop',
            eventDate: '2023-07-05',
            submissionDate: '2023-07-08',
            title: 'Entrepreneurship Workshop Summary',
            content: 'The Entrepreneurship Workshop was attended by 75 students from various departments. We had two successful entrepreneurs as guest speakers who shared their journey and offered practical advice. The networking session after the formal presentations allowed students to make valuable connections. We collected feedback forms which showed 92% satisfaction rate.',
            attachments: [
              { name: 'workshop_presentation.pdf', size: '5.2 MB' },
              { name: 'participant_list.xlsx', size: '120 KB' }
            ],
            attendeeCount: 75,
            rating: null
          }
        ];
        
        setReports(mockReports);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleRatingChange = (reportId, rating) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, rating } : report
      )
    );
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'unrated') return report.rating === null;
    if (filter === 'rated') return report.rating !== null;
    return true;
  });

  const renderStarRating = (report) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${report.rating >= i ? 'filled' : ''}`}
          onClick={() => handleRatingChange(report.id, i)}
        >
          ★
        </span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  if (isLoading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Society Event Reports</h1>
        <div className="filter-controls">
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Reports</option>
            <option value="unrated">Unrated</option>
            <option value="rated">Rated</option>
          </select>
        </div>
      </div>
      
      {filteredReports.length === 0 ? (
        <div className="no-reports">No reports found</div>
      ) : (
        <div className="reports-list">
          {filteredReports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <div className="report-society-info">
                  <h3>{report.title}</h3>
                  <div className="society-name">{report.society}</div>
                </div>
                {report.rating !== null && (
                  <div className="existing-rating">
                    Rating: <span className="rating-value">★ {report.rating}</span>
                  </div>
                )}
              </div>
              <hr />
              
              <div className="report-info">
                <div className="info-item">
                  <span className="info-label">Event</span>
                  <span className="info-value">{report.eventName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Event Date</span>
                  <span className="info-value">{report.eventDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Submitted</span>
                  <span className="info-value">{report.submissionDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Attendees</span>
                  <span className="info-value">{report.attendeeCount}</span>
                </div>
              </div>
              
              <div className="report-preview">
                <p>{report.content.substring(0, 150)}...</p>
              </div>
              
              <div className="report-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleViewReport(report)}
                >
                  View Full Report
                </button>
                <div className="rating-container">
                  <span className="rating-label">Rate:</span>
                  {renderStarRating(report)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="modal-overlay">
          <div className="modal report-modal">
            <div className="modal-header">
              <h2>{selectedReport.title}</h2>
              <button className="close-btn" onClick={() => setShowReportModal(false)}>×</button>
            </div>
            
            <div className="report-modal-content">
              <div className="report-meta">
                <div className="meta-section">
                  <h3>Event Information</h3>
                  <div className="meta-grid">
                    <div className="meta-item">
                      <span className="meta-label">Society:</span>
                      <span className="meta-value">{selectedReport.society}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Event:</span>
                      <span className="meta-value">{selectedReport.eventName}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Date:</span>
                      <span className="meta-value">{selectedReport.eventDate}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Attendees:</span>
                      <span className="meta-value">{selectedReport.attendeeCount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="meta-section">
                  <h3>Report Details</h3>
                  <div className="meta-grid">
                    <div className="meta-item">
                      <span className="meta-label">Submitted:</span>
                      <span className="meta-value">{selectedReport.submissionDate}</span>
                    </div>
                    {selectedReport.rating !== null && (
                      <div className="meta-item">
                        <span className="meta-label">Current Rating:</span>
                        <span className="meta-value rating">★ {selectedReport.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="report-content">
                <h3>Report Content</h3>
                <p>{selectedReport.content}</p>
              </div>
              
              <div className="report-attachments">
                <h3>Attachments</h3>
                <ul className="attachments-list">
                  {selectedReport.attachments.map((attachment, index) => (
                    <li key={index} className="attachment-item">
                      <span className="attachment-icon">📎</span>
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-size">{attachment.size}</span>
                      <button className="download-btn">Download</button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="report-rating-section">
                <h3>Rate This Report</h3>
                <div className="rating-container modal-rating">
                  {renderStarRating(selectedReport)}
                  <span className="rating-help">
                    Rating this report helps prioritize high-performing societies
                  </span>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
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

export default Reports;
