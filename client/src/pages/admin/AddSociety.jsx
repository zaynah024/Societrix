import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSociety, resetStatus } from '../../features/society/societySlice';
import { fetchChats } from '../../features/chat/chatUsersSlice.mjs';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/admin/AddSociety.css';

const AddSociety = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success } = useSelector((state) => state.society);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    password: '12345678',
    members: [],
    ratinngs: 5.0,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(createSociety(formData))
      .unwrap()
      .then((response) => {
        setSuccessMessage(
          'Society created successfully! A chat has been set up for communication.'
        );
        resetForm();

        // Refresh the chat list to include the new society
        dispatch(fetchChats());

        if (
          window.confirm(
            'Society created successfully with chat setup. Would you like to go to the chat page?'
          )
        ) {
          navigate('/chat');
        }
      })
      .catch((error) => {
        setErrorMessage(error || 'Failed to create society. Please try again.');
      });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      description: '',
    });
    dispatch(resetStatus());
  };

  const handleReset = () => {
    resetForm();
  };

  return (
    <div className="add-society-page">
      <div className="page-header">
        <h1>Add New Society</h1>
        <p>Create login credentials for a new student society</p>
      </div>

      <div className="form-card">
        {success && (
          <div className="success-message">
            Society has been successfully created! They can now log in with the provided credentials.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Society Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter society name"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter society email"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the society"
              className="form-control"
              rows="4"
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Society'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSociety;
