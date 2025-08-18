import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddListing.css';

const AddListing = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    organizationName: '',
    category: 'Decoration',
    availability: 'Yes',
    price: '',
    description: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Default image for services without photos
  const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop';

  useEffect(() => {
    const userData = localStorage.getItem('utshob_user');
    if (userData) {
      const userObj = JSON.parse(userData);
      if (userObj.role !== 'vendor') {
        navigate('/dashboard');
        return;
      }
      setUser(userObj);
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('organizationName', form.organizationName);
      formData.append('category', form.category);
      formData.append('availability', form.availability);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('vendorName', user.name);
      formData.append('vendorId', user._id);
      
      if (photo) {
        formData.append('photo', photo);
      }

      const res = await axios.post('/api/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Show success message and redirect
      alert('Service listing created successfully!');
      navigate('/vendor-dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create listing');
    }
    setLoading(false);
  };

  if (!user) return <div className="add-listing-bg"><div className="add-listing-container"><h2>Loading...</h2></div></div>;

  return (
    <div className="add-listing-bg">
      {/* Navigation Header */}
      <nav className="add-listing-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Utshob</span>
        </div>
        <div className="nav-user">
          <span className="user-greeting">Welcome, {user.name}!</span>
          <span className="user-role">Vendor</span>
          <button className="back-btn" onClick={() => navigate('/vendor-dashboard')}>
            <span>←</span> Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="add-listing-container">
        <div className="add-listing-content">
          <div className="add-listing-header">
            <h1>📝 Add New Service Listing</h1>
            <p>Create a compelling listing to attract customers to your services</p>
          </div>

          <form className="add-listing-form" onSubmit={handleSubmit}>
            {error && <div className="add-listing-error">{error}</div>}
            
            <div className="form-row">
              <div className="form-group">
                <label>Organization Name *</label>
                <input 
                  name="organizationName" 
                  type="text" 
                  placeholder="Enter your organization name" 
                  value={form.organizationName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Category *</label>
                                  <select 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange} 
                    required
                    className="category-select"
                  >
                    <option value="Decoration">Decoration</option>
                    <option value="Photography">Photography</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Music">Music</option>
                    <option value="Food">Food</option>
                  </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Availability *</label>
                <select 
                  name="availability" 
                  value={form.availability} 
                  onChange={handleChange} 
                  required
                  className="availability-select"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Price (৳) *</label>
                <input 
                  name="price" 
                  type="number" 
                  placeholder="Enter price in taka" 
                  value={form.price} 
                  onChange={handleChange} 
                  required 
                  min="1"
                />
              </div>
            </div>
            
                                <div className="form-group">
                      <label>Service Photo (Optional)</label>
                      <small className="photo-help-text">If no photo is provided, a default image will be used</small>
                      <div className="photo-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange}
                  className="photo-input"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="photo-upload-label">
                  <span>📷</span>
                  {photo ? 'Change Photo' : 'Choose Photo'}
                </label>
                                        {photoPreview && (
                          <div className="photo-preview">
                            <img src={photoPreview} alt="Preview" />
                            <button 
                              type="button" 
                              className="remove-photo-btn"
                              onClick={() => {
                                setPhoto(null);
                                setPhotoPreview(null);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        )}
              </div>
            </div>
            
            <div className="form-group">
              <label>Service Description *</label>
              <textarea 
                name="description" 
                placeholder="Describe your service in detail (max 150 words)" 
                value={form.description} 
                onChange={handleChange} 
                required 
                maxLength={150}
                rows={4}
              />
              <div className="word-count">
                {form.description.length}/150 words
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating Listing...' : 'List My Service'}
            </button>
          </form>
        </div>

        {/* Side Panel */}
        <div className="add-listing-side">
          <div className="side-content">
            <div className="side-icon">📋</div>
            <h2>Create Amazing Listings</h2>
            <p>Make your service stand out with compelling descriptions and clear pricing. Great listings attract more customers!</p>
            
            <div className="side-features">
              <div className="side-feature">
                <span className="feature-icon">✨</span>
                <span>Professional Presentation</span>
              </div>
              <div className="side-feature">
                <span className="feature-icon">📸</span>
                <span>Visual Appeal</span>
              </div>
              <div className="side-feature">
                <span className="feature-icon">💰</span>
                <span>Clear Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
