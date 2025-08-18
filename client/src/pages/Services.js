import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    priceFrom: '',
    priceTo: '',
    sortBy: 'newest', // 'newest', 'price-asc', 'price-desc'
    availability: 'all' // 'all', 'available', 'unavailable'
  });
  
  // Default image for services without photos
  const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('/api/services');
        setServices(res.data);
        setFilteredServices(res.data);
      } catch (err) {
        setServices([]);
        setFilteredServices([]);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  // Apply filters whenever filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, services]);

  const applyFilters = () => {
    let filtered = [...services];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(service => service.category === filters.category);
    }

    // Filter by price range
    if (filters.priceFrom) {
      filtered = filtered.filter(service => service.price >= parseInt(filters.priceFrom));
    }
    if (filters.priceTo) {
      filtered = filtered.filter(service => service.price <= parseInt(filters.priceTo));
    }

    // Filter by availability
    if (filters.availability === 'available') {
      filtered = filtered.filter(service => service.availability === 'Yes');
    } else if (filters.availability === 'unavailable') {
      filtered = filtered.filter(service => service.availability === 'No');
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredServices(filtered);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceFrom: '',
      priceTo: '',
      sortBy: 'newest',
      availability: 'all'
    });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleBookService = async (serviceId) => {
    try {
      // Get current user from localStorage
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
        // Refresh the services list to update availability
        window.location.reload();
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.msg || 'Failed to book service. Please try again.');
    }
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
           <h1>🔍 Look for Services</h1>
           <p>Discover amazing event services for your celebrations</p>
         </div>
         
         {/* Filter Panel */}
         {showFilters && (
           <div className="filter-panel">
             <div className="filter-header">
               <h3>🔍 Filter Services</h3>
               <button className="clear-filters-btn" onClick={clearFilters}>
                 <span>🔄</span> Clear All
               </button>
             </div>
             
             <div className="filter-grid">
               {/* Category Filter */}
               <div className="filter-group">
                 <label>Category</label>
                 <select 
                   value={filters.category} 
                   onChange={(e) => handleFilterChange('category', e.target.value)}
                   className="filter-select"
                 >
                   <option value="">All Categories</option>
                   <option value="Decoration">Decoration</option>
                   <option value="Photography">Photography</option>
                   <option value="Transportation">Transportation</option>
                   <option value="Music">Music</option>
                   <option value="Food">Food</option>
                 </select>
               </div>
               
               {/* Price Range Filter */}
               <div className="filter-group">
                 <label>Price Range (৳)</label>
                 <div className="price-range">
                   <input 
                     type="number" 
                     placeholder="From" 
                     value={filters.priceFrom}
                     onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                     className="price-input"
                   />
                   <span className="price-separator">to</span>
                   <input 
                     type="number" 
                     placeholder="To" 
                     value={filters.priceTo}
                     onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                     className="price-input"
                   />
                 </div>
               </div>
               
               {/* Sort By Filter */}
               <div className="filter-group">
                 <label>Sort By</label>
                 <select 
                   value={filters.sortBy} 
                   onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                   className="filter-select"
                 >
                   <option value="newest">Newest First</option>
                   <option value="price-asc">Price: Low to High</option>
                   <option value="price-desc">Price: High to Low</option>
                 </select>
               </div>
               
               {/* Availability Filter */}
               <div className="filter-group">
                 <label>Availability</label>
                 <select 
                   value={filters.availability} 
                   onChange={(e) => handleFilterChange('availability', e.target.value)}
                   className="filter-select"
                 >
                   <option value="all">All Services</option>
                   <option value="available">Available Only</option>
                   <option value="unavailable">Unavailable Only</option>
                 </select>
               </div>
             </div>
             
             <div className="filter-results">
               <span>Showing {filteredServices.length} of {services.length} services</span>
             </div>
           </div>
         )}
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading services...</p>
          </div>
        ) : (
                     <div className="services-content">
             {filteredServices.length === 0 ? (
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
        )}
      </div>
    </div>
  );
};

export default Services; 