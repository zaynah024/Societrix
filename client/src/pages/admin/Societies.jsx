import { useEffect, useState } from 'react';
import '../../styles/pages/admin/Societies.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocieties, resetStatus, deleteSociety, editDescription } from '../../features/society/societySlice';

const Societies = () => {
  const dispatch = useDispatch();
  const { societies, status, error, success } = useSelector((state) => state.society);

  const [searchQuery, setSearchQuery] = useState('');
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [editFormData, setEditFormData] = useState({ description: '' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSocieties());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (success) {
      dispatch(fetchSocieties());
      dispatch(resetStatus());
    }
  }, [dispatch, success]);

  const handleViewMembers = (society) => {
    setSelectedSociety(society);
    setShowMembersModal(true);
  };

  const handleEditDescription = (society) => {
    setSelectedSociety(society);
    setEditFormData({ description: society.description });
    setShowEditModal(true);
  };

  const handleDeleteSociety = (society) => {
    setSelectedSociety(society);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteSociety(selectedSociety._id));
    setShowDeleteModal(false);
  };

  const handleSaveDescription = () => {
    // Mock implementation for saving a description
    dispatch(editDescription({ id: selectedSociety._id, description: editFormData.description }));
    setShowEditModal(false);
  };

  const filteredSocieties = searchQuery
    ? (societies || []).filter((society) => // Add fallback for undefined societies
      society.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      society.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : societies || []; // Add fallback for undefined societies

  if (status === 'loading') {
    return <div className="loading">Loading societies...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="societies-page">
      <div className="page-header">
        <h1>Manage Societies</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search societies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      {filteredSocieties.length === 0 ? (
        <div className="no-societies">
          {searchQuery ? 'No societies match your search' : 'No societies registered yet'}
        </div>
      ) : (
        <div className="societies-grid">
          {filteredSocieties.map((society) => (
            <div key={society._id} className="society-card">
              <div className="society-header">
                <h2>{society.name}</h2>
                <div className="society-rating">★ {society.ratings}</div>
              </div>

              <div className="society-info">
                <div className="info-row">
                  <span className="info-label">Members:</span>
                  <span className="info-value">{society.memberCount}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{society.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Since:</span>
                  <span className="info-value">
                    {new Date(society.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="society-description">
                <h3>Description</h3>
                <p>{society.description}</p>
              </div>

              <div className="society-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewMembers(society)}
                >
                  View Members
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditDescription(society)}
                >
                  Edit Description
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteSociety(society)}
                >
                  Delete Society
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && selectedSociety && (
        <div className="modal-overlay">
          <div className="modal members-modal">
            <div className="modal-header">
              <h2>{selectedSociety.name} - Members</h2>
              <button className="close-btn" onClick={() => setShowMembersModal(false)}>×</button>
            </div>

            <div className="members-list">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSociety.members.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>{member.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowMembersModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Description Modal */}
      {showEditModal && selectedSociety && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Society Description</h2>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="form-control"
                rows="4"
              ></textarea>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveDescription}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSociety && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete "{selectedSociety.name}"? This action cannot be undone.</p>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete Society
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Societies;
