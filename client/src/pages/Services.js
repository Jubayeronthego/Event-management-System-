import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('/api/services');
        setServices(res.data);
      } catch (err) {
        setServices([]);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleBookService = (serviceId) => {
    // TODO: Implement booking functionality
    alert(`Booking functionality for service ${serviceId} will be implemented soon!`);
  };

  return (
    <div className="services-bg">
      {/* Navigation Header */}
      <nav className="services-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Utshob</span>
        </div>
        <div className="nav-actions">
          <button className="back-btn" onClick={handleBackToDashboard}>
            <span>←</span> Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="services-container">
        <div className="services-header">
          <h1>🔍 Look for Services</h1>
          <p>Discover amazing event services for your celebrations</p>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading services...</p>
          </div>
        ) : (
          <div className="services-content">
            {services.length === 0 ? (
              <div className="no-services">
                <div className="no-services-icon">📭</div>
                <h3>No services at this moment</h3>
                <p>Check back later for amazing event services!</p>
                <button className="back-dashboard-btn" onClick={handleBackToDashboard}>
                  <span>←</span> Back to Dashboard
                </button>
              </div>
            ) : (
              <div className="services-grid">
                {services.map(service => (
                  <div className="service-card" key={service._id}>
                    <div className="service-image" style={{backgroundImage: `url(${service.images?.[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop'})`}}>
                      <div className="service-overlay">
                        <span className="service-category">{service.category}</span>
                      </div>
                    </div>
                    <div className="service-content">
                      <h4 className="service-name">{service.name}</h4>
                      <p className="service-description">{service.description}</p>
                      <div className="service-footer">
                        <span className="service-price">৳{service.price}</span>
                        <span className={`service-status ${!service.availability ? 'unavailable' : ''}`}>
                          {service.availability ? '✅ Available' : '❌ Unavailable'}
                        </span>
                      </div>
                      <button 
                        className="book-service-btn" 
                        onClick={() => handleBookService(service._id)}
                        disabled={!service.availability}
                      >
                        <span>📅</span> Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services; 