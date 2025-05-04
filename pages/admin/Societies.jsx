import { useState, useEffect } from 'react';
import '../../styles/pages/admin/Societies.css';

const Societies = () => {
  const [societies, setSocieties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [editFormData, setEditFormData] = useState({ description: '' });

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        // Simulate API call
        
        // Mock data
        const mockSocieties = [
          {
            id: 1,
            name: 'Computer Science Society',
            description: 'For students interested in computer science, software development, and technology.',
            memberCount: 45,
            members: [
              { id: 1, name: 'John Doe', role: 'President', email: 'john.doe@example.com' },
              { id: 2, name: 'Jane Smith', role: 'Vice President', email: 'jane.smith@example.com' },
              { id: 3, name: 'Mike Johnson', role: 'Secretary', email: 'mike@example.com' },
              // ... more members would be here in a real app
            ],
            email: 'cs.society@university.edu',
            createdAt: '2023-01-15',
            rating: 4.9
          },
          {
            id: 2,
            name: 'Drama Club',
            description: 'Society for theater enthusiasts focused on producing and performing plays and dramas.',
            memberCount: 32,
            members: [
              { id: 4, name: 'Sarah Williams', role: 'President', email: 'sarah@example.com' },
              { id: 5, name: 'David Brown', role: 'Director', email: 'david@example.com' },
              // ... more members would be here in a real app
            ],
            email: 'drama.club@university.edu',
            createdAt: '2023-02-10',
            rating: 4.8
          },
          {
            id: 3,
            name: 'Physics Society',
            description: 'Group dedicated to physics research, experiments, and discussions about theoretical physics.',
            memberCount: 28,
            members: [
              { id: 6, name: 'Emma Wilson', role: 'President', email: 'emma@example.com' },
              { id: 7, name: 'Robert Taylor', role: 'Treasurer', email: 'robert@example.com' },
              // ... more members would be here in a real app
            ],
            email: 'physics.society@university.edu',
            createdAt: '2023-01-20',
            rating: 4.7
          },
          {
            id: 4,
            name: 'Debate Club',
            description: 'Forum for students to practice and enhance their debating and public speaking skills.',
            memberCount: 22,
            members: [
              { id: 8, name: 'Alex Turner', role: 'President', email: 'alex@example.com' },
              { id: 9, name: 'Lisa Adams', role: 'Vice President', email: 'lisa@example.com' },
              // ... more members would be here in a real app
            ],
            email: 'debate.club@university.edu',
            createdAt: '2023-03-05',
            rating: 4.6
          }
        ];
        
        setSocieties(mockSocieties);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching societies:', error);
        setIsLoading(false);
      }
    };

    fetchSocieties();
  }, []);

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
    // Remove the society from the list
    setSocieties(prev => prev.filter(s => s.id !== selectedSociety.id));
    
    // Close the modal
    setShowDeleteModal(false);
    setSelectedSociety(null);
  };

  const handleSaveDescription = () => {
    // Update the society description
    setSocieties(prev => 
      prev.map(s => 
        s.id === selectedSociety.id ? { ...s, description: editFormData.description } : s
      )
    );
    
    // Close the modal
    setShowEditModal(false);
    setSelectedSociety(null);
  };

  const filteredSocieties = searchQuery 
    ? societies.filter(society => 
        society.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        society.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : societies;

  if (isLoading) {
    return <div className="loading">Loading societies...</div>;
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
          {filteredSocieties.map(society => (
            <div key={society.id} className="society-card">
              <div className="society-header">
                <h2>{society.name}</h2>
                <div className="society-rating">★ {society.rating}</div>
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
                  <span className="info-value">{society.createdAt}</span>
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
