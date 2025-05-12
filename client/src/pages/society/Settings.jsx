import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/pages/society/Settings.css';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    profileImage: user?.profileImage || null
  });
  
  // Mock user profile fetch
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching user profile...');
        
        // Skip actual API call and use Redux user data directly
        setProfileData(prevData => ({
          ...prevData,
          name: user?.name || 'Society User',
          email: user?.email || 'society@example.com',
        }));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({
          ...profileData,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (profileData.password !== profileData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    // In a real app, you would send this data to your API
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
  };
  
  const handleNotificationChange = (setting, value) => {
    console.log(`Changed notification setting ${setting} to ${value}`);
    // In a real app, you would update the user's notification preferences
  };
  
  if (isLoading) {
    return <div className="settings-loading">Loading profile data...</div>;
  }
  
  return (
    <div className="settings-container">
      <h1 className="settings-title">Profile Settings</h1>
      
      <div className="settings-card">
        <div className="settings-section">
          <h2>Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="profile-image-section">
              <div className="profile-image-container">
                {profileData.profileImage ? (
                  <img src={profileData.profileImage} alt="Profile" className="profile-image" />
                ) : (
                  <div className="profile-image-placeholder">
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-image-upload">
                <label htmlFor="profileImage" className="upload-button">
                  Change Profile Photo
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-divider"></div>
            <h3>Change Password</h3>
            
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={profileData.password}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            
            <button type="submit" className="save-button">Save Changes</button>
          </form>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="settings-section">
          <h2>Notification Settings</h2>
          <div className="notification-settings">
            <div className="notification-option">
              <div>
                <h4>Event Updates</h4>
                <p>Get notified about changes to events</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  defaultChecked={true} 
                  onChange={(e) => handleNotificationChange('eventUpdates', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="notification-option">
              <div>
                <h4>Society Announcements</h4>
                <p>Receive important society announcements</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  defaultChecked={true} 
                  onChange={(e) => handleNotificationChange('announcements', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="notification-option">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive notifications via email</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  defaultChecked={true} 
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;