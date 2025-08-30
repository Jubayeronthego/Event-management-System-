import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ReviewsAndRatings.css';

const ReviewsAndRatings = () => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('utshob_user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      
      // Get services from location state (passed from payment page)
      if (location.state && location.state.services) {
        setServices(location.state.services);
        setLoading(false);
      } else {
        // If no services passed, redirect to dashboard
        navigate('/dashboard');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate, location]);

  const handleReviewChange = (serviceId, value) => {
    setReviews(prev => ({
      ...prev,
      [serviceId]: value
    }));
  };

  const handleRatingChange = (serviceId, value) => {
    setRatings(prev => ({
      ...prev,
      [serviceId]: parseInt(value)
    }));
  };

  const handleDone = async () => {
    setSubmitting(true);
    
    try {
      const promises = [];

      // Submit reviews
      Object.keys(reviews).forEach(serviceId => {
        const review = reviews[serviceId];
        if (review && review.trim()) {
          const service = services.find(s => s.serviceId === serviceId);
          if (service) {
            promises.push(
              axios.post('/api/reviews/submit', {
                customerId: user._id,
                customerName: user.name,
                vendorId: service.vendorId || service.serviceId, // Fallback
                vendorName: service.vendorName || 'Unknown Vendor',
                serviceId: serviceId,
                serviceName: service.serviceName,
                comment: review.trim()
              })
            );
          }
        }
      });

      // Submit ratings
      Object.keys(ratings).forEach(serviceId => {
        const rating = ratings[serviceId];
        if (rating && rating >= 1 && rating <= 5) {
          const service = services.find(s => s.serviceId === serviceId);
          if (service) {
            promises.push(
              axios.post('/api/ratings/submit', {
                customerId: user._id,
                customerName: user.name,
                vendorId: service.vendorId || service.serviceId, // Fallback
                vendorName: service.vendorName || 'Unknown Vendor',
                serviceId: serviceId,
                serviceName: service.serviceName,
                rating: rating
              })
            );
          }
        }
      });

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      // Show success message and redirect
      alert('Thank you for your feedback!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLater = () => {
    alert('Thank you for your feedback!');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="reviews-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      {/* Header */}
      <header className="reviews-header">
        <div className="header-content">
          <div className="header-left">
            <h1>⭐ Reviews & Ratings</h1>
            <p>Share your experience with the services you just paid for</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Services List */}
      <div className="services-container">
        <div className="services-header">
          <h2>How was your Utshob?</h2>
          <p>Leave a comment below.</p>
        </div>

        <div className="services-list">
          {services.map((service, index) => (
            <div key={service.serviceId} className="service-card">
              <div className="service-header">
                <div className="service-info">
                  <h3>{service.serviceName}</h3>
                  <span className="service-price">৳{service.servicePrice}</span>
                </div>
                <div className="service-number">#{index + 1}</div>
              </div>

              {/* Rating Section */}
              <div className="rating-section">
                <label className="rating-label">
                  <span>⭐</span> Rate this service (1-5 stars):
                </label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${ratings[service.serviceId] >= star ? 'active' : ''}`}
                      onClick={() => handleRatingChange(service.serviceId, star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="rating-text">
                  {ratings[service.serviceId] ? `${ratings[service.serviceId]} out of 5 stars` : 'No rating selected'}
                </span>
              </div>

              {/* Review Section */}
              <div className="review-section">
                <label className="review-label">
                  <span>💬</span> Write a review (optional):
                </label>
                <textarea
                  className="review-textarea"
                  placeholder="Share your experience with this service..."
                  value={reviews[service.serviceId] || ''}
                  onChange={(e) => handleReviewChange(service.serviceId, e.target.value)}
                  rows="4"
                />
                <span className="review-count">
                  {reviews[service.serviceId]?.length || 0} characters
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="done-btn"
            onClick={handleDone}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : '✅ Done'}
          </button>
          <button 
            className="later-btn"
            onClick={handleLater}
            disabled={submitting}
          >
            ⏰ Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsAndRatings;
