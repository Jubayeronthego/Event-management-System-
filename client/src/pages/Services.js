import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    availability: 'all',
    category: 'all'
  });
  const navigate = useNavigate();

  // Default image for services without photos
  const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop';

  // Available categories for dropdown
  const categories = [
    'Decoration',
    'Transportation',
    'Photography',
    'Music',
    'Food'
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/services');
      console.log('Services fetched:', response.data);
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...services];

    // Filter by price range
    if (filters.priceMin !== '') {
      filtered = filtered.filter(service => service.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax !== '') {
      filtered = filtered.filter(service => service.price <= parseFloat(filters.priceMax));
    }

    // Filter by availability
    if (filters.availability !== 'all') {
      filtered = filtered.filter(service => 
        filters.availability === 'available' ? service.availability === 'Yes' : service.availability === 'No'
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(service => service.category === filters.category);
    }

    setFilteredServices(filtered);
  }, [filters, services]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      availability: 'all',
      category: 'all'
    });
  };

  const handleBookService = async (serviceId) => {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem('utshob_user');
      if (!userData) {
        alert('Please log in to book a service');
        navigate('/signin');
        return;
      }

      const user = JSON.parse(userData);
      
      // Check if user is a customer
      if (user.role !== 'customer') {
        alert('Only customers can book services');
        return;
      }

      // Create booking
      const bookingData = {
        customerId: user._id,
        serviceId: serviceId
      };

      const response = await axios.post('/api/bookings', bookingData);
      
      if (response.data.msg === 'Booking created successfully') {
        alert('Service booked successfully! Check your dashboard for details.');
        // Refresh the services list
        fetchServices();
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.msg || 'Failed to book service. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="services-bg">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-bg">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3>Error Loading Services</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchServices}>
            🔄 Try Again
          </button>
          <button className="back-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-bg">
      {/* Navigation Header */}
      <nav className="services-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Utshob</span>
        </div>
        <div className="nav-actions">
          <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
            <span>🔍</span> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="back-btn" onClick={handleBackToDashboard}>
            <span>←</span> Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="services-container">
                 <div className="services-header">
           <h1>🔍 Find your Utshob</h1>
           <p>Discover amazing event services for your celebrations</p>
          {filteredServices.length !== services.length && (
            <div className="filter-info">
              <span>Showing {filteredServices.length} of {services.length} services</span>
              <button className="clear-filters-btn" onClick={clearFilters}>
                🗑️ Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Filter Interface */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>🔍 Filter Services</h3>
              <p>Customize your search to find the perfect service</p>
            </div>
            
            <div className="filters-grid">
              {/* Price Range */}
              <div className="filter-group">
                <label>Price Range (৳)</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    min="0"
                  />
                  <span className="price-separator">to</span>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="filter-group">
                <label>Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                >
                  <option value="all">All Services</option>
                  <option value="available">Available Only</option>
                  <option value="unavailable">Unavailable Only</option>
                </select>
              </div>

              {/* Category */}
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filters-actions">
              <button className="clear-filters-btn" onClick={clearFilters}>
                🗑️ Clear All Filters
              </button>
            </div>
          </div>
        )}
        
        {filteredServices.length === 0 ? (
          <div className="no-services">
            <div className="no-services-icon">🔍</div>
            <h3>No services match your filters</h3>
            <p>Try adjusting your search criteria or clear all filters</p>
            <button className="clear-filters-btn" onClick={clearFilters}>
              🗑️ Clear Filters
            </button>
            <button className="back-dashboard-btn" onClick={handleBackToDashboard}>
              <span>←</span> Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map(service => (
              <div className="service-card" key={service._id}>
                <div className="service-image" style={{backgroundImage: `url(${service.photo || DEFAULT_SERVICE_IMAGE})`}}>
                  <div className="service-overlay">
                    <span className="service-category">{service.category}</span>
                  </div>
                </div>
                <div className="service-content">
                  <h4 className="service-name">{service.organizationName}</h4>
                  <p className="service-vendor">by {service.vendorName}</p>
                  <p className="service-description">{service.description}</p>
                  <div className="service-footer">
                    <span className="service-price">৳{service.price}</span>
                    <span className={`service-status ${service.availability === 'No' ? 'unavailable' : ''}`}>
                      {service.availability === 'Yes' ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>
                  <button 
                    className="book-service-btn" 
                    onClick={() => handleBookService(service._id)}
                    disabled={service.availability === 'No'}
                  >
                    <span>📅</span> Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
