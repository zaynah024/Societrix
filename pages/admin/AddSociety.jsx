import { useState } from 'react';
import '../../styles/pages/admin/AddSociety.css';

const AddSociety = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulate API call
      console.log('Society created:', formData);
      
      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        password: '',
        description: ''
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to create society. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="form-control"
              required
            />
            <small className="form-text">Password must be at least 8 characters</small>
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
              onClick={() => setFormData({
                name: '',
                email: '',
                password: '',
                description: ''
              })}
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
