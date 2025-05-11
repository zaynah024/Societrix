import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile, resetStatus } from "../../features/user/userSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, status, error, success } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    displayName: "",
    photo: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const userId = 1; // Replace with the actual user ID

  useEffect(() => {
    console.log("Fetching user profile...");
    dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user && !isEditing) {
      console.log("User data:", user);
      setFormData({
        displayName: user.displayName || "",
        photo: null,
      });
    }
  }, [user, isEditing]);

  useEffect(() => {
    if (success) {
      alert("Profile updated successfully!");
      dispatch(resetStatus());
    }
  }, [success, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    dispatch(updateUserProfile({ userId, userData: formData }));
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        photo: null,
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading user settings...</p>
      </div>
    );
  }

  if (status === "failed") {
    console.error("Error fetching user profile:", error);
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Manage your preferences and account settings</p>
      </div>

      <div className="card">
        <div className="tabs">
          <div className="tab-list">
            <div
              className={`tab-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </div>
            <div
              className={`tab-item ${activeTab === "appearance" ? "active" : ""}`}
              onClick={() => setActiveTab("appearance")}
            >
              Appearance
            </div>
          </div>
        </div>

        {activeTab === "profile" && (
          <div className="society-tab-content">
            <h3 className="text-lg font-medium mb-6">Profile Settings</h3>
            <p className="text-sm text-gray-500 mb-6">Update your personal information</p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-group">
                    <label htmlFor="displayName" className="form-label">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      className="form-input"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="photo" className="form-label">
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      className="form-input"
                      onChange={handlePhotoChange}
                      disabled={!isEditing}
                    />
                  </div>

                  {formData.photo && (
                    <div className="form-group">
                      <img
                        src={URL.createObjectURL(formData.photo)}
                        alt="Profile Preview"
                        className="profile-preview"
                      />
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="society-tab-content">
            <h3 className="settings-section-title">Appearance Settings</h3>
            <p className="settings-description">Customize your application appearance</p>

            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="theme" className="form-label">
                  Theme
                </label>
                <select
                  id="theme"
                  className="form-select"
                  value={localStorage.getItem("theme") || "light"}
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    localStorage.setItem("theme", newTheme);

                    if (newTheme === "dark") {
                      document.body.classList.add("dark-mode");
                    } else {
                      document.body.classList.remove("dark-mode");
                    }
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fontSize" className="form-label">
                  Font Size
                </label>
                <select
                  id="fontSize"
                  className="form-select"
                  value={localStorage.getItem("fontSize") || "medium"}
                  onChange={(e) => {
                    const newSize = e.target.value;
                    localStorage.setItem("fontSize", newSize);
                  }}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;