import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSocietyReports, 
  updateReportRating 
} from '../../features/reports/reportSlice.mjs';
import { fetchSocieties } from '../../features/society/societySlice.mjs';
import '../../styles/pages/admin/Reports.css';

const Reports = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'unrated', 'rated'
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState({});

  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.reports);

  useEffect(() => {
    // Fetch reports and societies when component mounts
    dispatch(fetchSocietyReports());
    dispatch(fetchSocieties()); // Also fetch societies initially
  }, [dispatch]); 

  const handleRatingChange = (reportId, rating, e) => {
    // Prevent default if event is passed
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Store the current rating to revert if there's an error
    const currentReports = [...reports];
    
    // Optimistically update the UI first
    const reportIndex = reports.findIndex(r => r._id === reportId);
    if (reportIndex !== -1) {
      const updatedReports = [...reports];
      updatedReports[reportIndex] = { ...updatedReports[reportIndex], rating };
      
      // Dispatch an action to update the reports in redux store without a network request
      dispatch({ type: 'reports/setReports', payload: updatedReports });
      
      // If there's a selected report and it's the one being updated, update that too
      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport(prev => ({ ...prev, rating }));
      }
    }
    
    // Then dispatch the API call to update the backend
    dispatch(updateReportRating({ id: reportId, rating }))
      .unwrap()
      .then(() => {
        console.log('Report rating updated successfully');
        // No need to fetch societies here since updateReportRating already does that
      })
      .catch(error => {
        console.error('Failed to update rating:', error);
        // Revert to previous state on error
        dispatch({ type: 'reports/setReports', payload: currentReports });
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(prev => ({ 
            ...prev, 
            rating: currentReports.find(r => r._id === reportId)?.rating 
          }));
        }
      });
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDownloadAttachment = async (reportId, attachmentName) => {
    try {
      setDownloadStatus((prev) => ({
        ...prev,
        [`${reportId}_${attachmentName}`]: 'downloading'
      }));

      // Make API call to fetch the attachment
      const response = await fetch(`/api/reports/${reportId}/attachments/${encodeURIComponent(attachmentName)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error downloading attachment: ${response.statusText}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and click it to download
      const link = document.createElement('a');
      link.href = url;
      link.download = attachmentName;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadStatus((prev) => ({
        ...prev,
        [`${reportId}_${attachmentName}`]: 'completed'
      }));

      // Reset status after a delay
      setTimeout(() => {
        setDownloadStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[`${reportId}_${attachmentName}`];
          return newStatus;
        });
      }, 3000);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus((prev) => ({
        ...prev,
        [`${reportId}_${attachmentName}`]: 'failed'
      }));

      // Reset status after a delay
      setTimeout(() => {
        setDownloadStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[`${reportId}_${attachmentName}`];
          return newStatus;
        });
      }, 3000);
    }
  };

  const renderDownloadButton = (reportId, attachment) => {
    const status = downloadStatus[`${reportId}_${attachment.name}`];

    switch (status) {
      case 'downloading':
        return <button className="download-btn downloading">Downloading...</button>;
      case 'completed':
        return <button className="download-btn completed">Downloaded ✓</button>;
      case 'failed':
        return <button className="download-btn failed" onClick={() => handleDownloadAttachment(reportId, attachment.name)}>Retry</button>;
      default:
        return <button className="download-btn" onClick={() => handleDownloadAttachment(reportId, attachment.name)}>Download</button>;
    }
  };

  const filteredReports = reports.filter((report) => {
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
          onClick={(e) => handleRatingChange(report._id, i, e)}
        >
          ★
        </span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  if (loading) {
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
            <div key={report._id} className="report-card">
              <div className="report-header">
                <div className="report-society-info">
                  <h3>{report.title}</h3>
                  <div className="society-name">{report.society}</div>
                </div>
                <div className="existing-rating">
                  Rating: <span className="rating-value">★ {report.rating || 0}</span>
                </div>
              </div>
              <hr />

              <div className="report-info">
                <div className="info-item">
                  <span className="info-label">Society</span>
                  <span className="info-value">{report.societyName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Event Date</span>
                  <span className="info-value">{new Date(report.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Submitted</span>
                  <span className="info-value">{new Date(report.submissionDate).toLocaleDateString()}</span>
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
                      <span className="meta-value">{selectedReport.societyName}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Event:</span>
                      <span className="meta-value">{selectedReport.eventName}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Date:</span>
                      <span className="meta-value">{new Date(selectedReport.eventDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="meta-section">
                  <h3>Report Details</h3>
                  <div className="meta-grid">
                    <div className="meta-item">
                      <span className="meta-label">Submitted:</span>
                      <span className="meta-value">{new Date(selectedReport.submissionDate).toLocaleDateString()}</span>
                    </div>
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
                    <li key={`${selectedReport._id}_${attachment.name}`} className="attachment-item"> {/* Use a combination of selectedReport._id and attachment.name */}
                      <span className="attachment-icon">📎</span>
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-size">{attachment.size}</span>
                      {renderDownloadButton(selectedReport._id, attachment)}
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
