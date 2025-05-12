import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/pages/society/SocietyManagement.css';
import axios from 'axios';

const SocietyManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const { societies } = useSelector((state) => state.society);
  const { events } = useSelector((state) => state.events);

  // Find society based on current user
  const currentSociety = societies?.find(
    (society) => society?._id === user?.societyId || society?.email === user?.email
  ) || {
    name: "Your Society",
    description: "No description available. Add information about your society to help members understand its purpose and activities.",
    foundedYear: new Date().getFullYear(),
    logo: "",
    members: [],
    events: [],
    _id: "placeholder-id"
  };

  const [activeTab, setActiveTab] = useState('about');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    description: currentSociety?.description || "",
    socialLinks: currentSociety?.socialLinks || {
      instagram: "",
      twitter: "",
      linkedin: "",
      facebook: ""
    },
    contactEmail: currentSociety?.contactEmail || user?.email || "",
    foundedYear: currentSociety?.foundedYear || new Date().getFullYear(),
    vision: currentSociety?.vision || "Our vision is to create an inclusive community where members can grow and excel.",
    mission: currentSociety?.mission || "Our mission is to provide opportunities for personal and professional development."
  });

  // Member management
  const [members, setMembers] = useState(currentSociety?.members || []);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "member",
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Filter society events - Add null check for events
  const societyEvents = Array.isArray(events) 
    ? events.filter(event => event?.societyId === currentSociety?._id)
    : [];
    
  const upcomingEvents = societyEvents.filter(event => 
    new Date(event.date) > new Date() && event.status !== 'rejected'
  );
  
  const pastEvents = societyEvents.filter(event => 
    new Date(event.date) <= new Date() || event.status === 'completed'
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember({
      ...newMember,
      [name]: value
    });
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      alert('Name and email are required.');
      return;
    }
  
    // Check for duplicate email
    if (members.some(member => member.email === newMember.email)) {
      alert('A member with this email already exists.');
      return;
    }
  
    try {
      const response = await axios.post(`/api/societies/${currentSociety._id}/members`, newMember);
      const addedMember = response.data;
  
      setMembers([...members, addedMember]); // Update the local state with the new member
      setNewMember({
        name: "",
        email: "",
        role: "member",
        joinDate: new Date().toISOString().split('T')[0]
      });
      setIsAddMemberModalOpen(false);
      alert('Member added successfully!');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member. Please try again.');
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter(member => member.email !== email));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save society info (in a real app, this would send data to the backend)
    console.log("Saving society info:", { ...formData, members });
    setIsEditModalOpen(false);
    
    // Show success notification
    alert("Society information updated successfully!");
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="society-management-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{currentSociety.name}</h1>
          <p className="page-subtitle">Manage your society details, members, and events</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Society
        </button>
      </div>

      <div className="society-main-content">
        <div className="society-card info-card">
          <div className="society-header">
            <div className="society-logo">
              {currentSociety.logo ? (
                <img src={currentSociety.logo} alt={`${currentSociety.name} logo`} />
              ) : (
                <div className="society-logo-placeholder">
                  {getInitials(currentSociety.name)}
                </div>
              )}
            </div>
            <div className="society-header-details">
              <h2>{currentSociety.name}</h2>
              <p className="society-meta">
                <span>Founded: {formData.foundedYear}</span>
                <span className="meta-separator">•</span>
                <span>{members.length} Members</span>
                <span className="meta-separator">•</span>
                <span>{societyEvents.length} Events</span>
              </p>
            </div>
          </div>

          <div className="society-tabs">
            <div 
              className={`society-tab ${activeTab === 'about' ? 'active' : ''}`} 
              onClick={() => setActiveTab('about')}
            >
              About
            </div>
            <div 
              className={`society-tab ${activeTab === 'members' ? 'active' : ''}`} 
              onClick={() => setActiveTab('members')}
            >
              Members
            </div>
            <div 
              className={`society-tab ${activeTab === 'events' ? 'active' : ''}`} 
              onClick={() => setActiveTab('events')}
            >
              Events
            </div>
          </div>

          {activeTab === 'about' && (
            <div className="society-tab-content">
              <div className="about-section">
                <h3>Description</h3>
                <p>{formData.description}</p>
              </div>
              
              <div className="about-section">
                <h3>Vision</h3>
                <p>{formData.vision}</p>
              </div>
              
              <div className="about-section">
                <h3>Mission</h3>
                <p>{formData.mission}</p>
              </div>

              <div className="about-section">
                <h3>Contact Information</h3>
                <p>Email: {formData.contactEmail}</p>
                
                {Object.entries(formData.socialLinks).some(([_, value]) => value) && (
                  <div className="social-links">
                    <h4>Follow us:</h4>
                    <div className="social-icons">
                      {formData.socialLinks.instagram && (
                        <a href={formData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      )}
                      {formData.socialLinks.twitter && (
                        <a href={formData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      )}
                      {formData.socialLinks.linkedin && (
                        <a href={formData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      )}
                      {formData.socialLinks.facebook && (
                        <a href={formData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="society-tab-content">
              <div className="members-header">
                <h3>Society Members</h3>
                <button className="btn btn-secondary" onClick={() => setIsAddMemberModalOpen(true)}>
                  Add Member
                </button>
              </div>

              {members.length === 0 ? (
                <div className="empty-members">
                  <p>No members added yet. Click "Add Member" to add society members.</p>
                </div>
              ) : (
                <div className="members-table-container">
                  <table className="members-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Join Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member, index) => (
                        <tr key={index}>
                          <td>{member.name}</td>
                          <td>{member.email}</td>
                          <td>{member.role}</td>
                          <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn btn-danger btn-sm" 
                              onClick={() => handleRemoveMember(member.email)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="society-tab-content">
              <div className="events-section">
                <h3>Upcoming Events</h3>
                {upcomingEvents.length === 0 ? (
                  <p className="no-events">No upcoming events scheduled.</p>
                ) : (
                  <div className="event-cards">
                    {upcomingEvents.map(event => (
                      <div className="event-card" key={event._id}>
                        <div className="event-date">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <h4>{event.eventName}</h4>
                        <p>{event.description?.substring(0, 100)}...</p>
                        <div className="event-status">
                          Status: <span className={`status-${event.status}`}>{event.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="events-section">
                <h3>Past Events</h3>
                {pastEvents.length === 0 ? (
                  <p className="no-events">No past events.</p>
                ) : (
                  <div className="past-events-list">
                    <table className="events-table">
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Date</th>
                          <th>Venue</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastEvents.map(event => (
                          <tr key={event._id}>
                            <td>{event.eventName}</td>
                            <td>{new Date(event.date).toLocaleDateString()}</td>
                            <td>{event.venue || 'N/A'}</td>
                            <td>
                              <span className={`status-${event.status}`}>{event.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Society Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Society Information</h2>
              <button className="close-button" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="society-form">
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="vision">Vision Statement:</label>
                <textarea
                  id="vision"
                  name="vision"
                  value={formData.vision}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="mission">Mission Statement:</label>
                <textarea
                  id="mission"
                  name="mission"
                  value={formData.mission}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="foundedYear">Founded Year:</label>
                <input
                  type="number"
                  id="foundedYear"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email:</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                />
              </div>

              <h3>Social Media Links</h3>
              <div className="form-group">
                <label htmlFor="instagram">Instagram:</label>
                <input
                  type="url"
                  id="instagram"
                  name="socialLinks.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/your-handle"
                />
              </div>

              <div className="form-group">
                <label htmlFor="twitter">Twitter:</label>
                <input
                  type="url"
                  id="twitter"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/your-handle"
                />
              </div>

              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn:</label>
                <input
                  type="url"
                  id="linkedin"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/company/your-handle"
                />
              </div>

              <div className="form-group">
                <label htmlFor="facebook">Facebook:</label>
                <input
                  type="url"
                  id="facebook"
                  name="socialLinks.facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/your-page"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Member</h2>
              <button className="close-button" onClick={() => setIsAddMemberModalOpen(false)}>×</button>
            </div>
            
            <form className="add-member-form">
              <div className="form-group">
                <label htmlFor="member-name">Name:</label>
                <input
                  type="text"
                  id="member-name"
                  name="name"
                  value={newMember.name}
                  onChange={handleNewMemberChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="member-email">Email:</label>
                <input
                  type="email"
                  id="member-email"
                  name="email"
                  value={newMember.email}
                  onChange={handleNewMemberChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="member-role">Role:</label>
                <select
                  id="member-role"
                  name="role"
                  value={newMember.role}
                  onChange={handleNewMemberChange}
                >
                  <option value="member">Member</option>
                  <option value="secretary">Secretary</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="vice-president">Vice President</option>
                  <option value="president">President</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="member-join-date">Join Date:</label>
                <input
                  type="date"
                  id="member-join-date"
                  name="joinDate"
                  value={newMember.joinDate}
                  onChange={handleNewMemberChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddMemberModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddMember}>
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocietyManagement;