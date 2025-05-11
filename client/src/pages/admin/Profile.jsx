import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/admin/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  
  // Initialize with localStorage values if available
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('user_name') || 'Hissan Butt',
    email: localStorage.getItem('user_email') || 'admin@societrix.com',
    phone: '+92 333 456 9111',
    role: 'System Administrator',
    joinDate: 'January 11, 2024',
    profilePicture: 'src/assets/IMG_7624.JPG'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  
  // Update form data if localStorage values change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: profileData.name,
      email: profileData.email
    }));
  }, [profileData.name, profileData.email]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling
      setFormData({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
    setSuccessMessage('');
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Only validate password fields if any of them have values
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      
      if (formData.newPassword && formData.newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('user_name', formData.name);
      localStorage.setItem('user_email', formData.email);
      
      // Update profile data
      setProfileData({
        ...profileData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    }
  };
  
  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="header-left">
            <button className="back-button" onClick={handleBackClick}>
              <span className="back-icon">←</span> Back to Dashboard
            </button>
            <h1>Admin Profile</h1>
          </div>
          <button 
            className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`} 
            onClick={handleEditToggle}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <div className="profile-content">
          <div className="profile-picture-section">
            <div className="profile-picture-container" onClick={handleProfilePictureClick}>
              <img 
                src={profileData.profilePicture} 
                alt="Profile" 
                className="profile-picture"
              />
              <div className="profile-picture-overlay">
                <span>Change Photo</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="profile-role">{profileData.role}</div>
            <div className="profile-join-date">Joined: {profileData.joinDate}</div>
          </div>
          
          <div className="profile-details">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  />
                  {errors.name && <div className="error-text">{errors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && <div className="error-text">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                
                <div className="form-section-divider">
                  <span>Change Password</span>
                </div>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                  />
                  {errors.currentPassword && <div className="error-text">{errors.currentPassword}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                  />
                  {errors.newPassword && <div className="error-text">{errors.newPassword}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
                </div>
                
                {errors.submit && <div className="error-message">{errors.submit}</div>}
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{profileData.name}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{profileData.email}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">{profileData.phone}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Password</span>
                  <span className="info-value">••••••••</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
