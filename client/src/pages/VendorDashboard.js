import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
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
             
             // Fetch vendor's listings and bookings
             fetchVendorListings(userObj._id);
             fetchVendorBookings(userObj._id);
          }
  }, [navigate]);

            const fetchVendorListings = async (vendorId) => {
            try {
              setListingsLoading(true);
              console.log('Fetching listings for vendor:', vendorId);
              const response = await axios.get('/api/services');
              const allServices = response.data;
              console.log('All services:', allServices);
              const vendorServices = allServices.filter(service => service.vendorId === vendorId);
              console.log('Vendor services:', vendorServices);
              setListings(vendorServices);
            } catch (error) {
              console.error('Error fetching listings:', error);
            } finally {
              setListingsLoading(false);
            }
          };

          const fetchVendorBookings = async (vendorId) => {
            try {
              setBookingsLoading(true);
              const response = await axios.get(`/api/bookings/vendor/${vendorId}`);
              setBookings(response.data);
            } catch (error) {
              console.error('Error fetching bookings:', error);
            } finally {
              setBookingsLoading(false);
            }
          };

  const handleSignOut = () => {
    localStorage.removeItem('utshob_user');
    navigate('/');
  };

  const handleAddListing = () => {
    navigate('/add-listing');
  };

  // Function to refresh listings when returning from add listing page
            const refreshListings = () => {
            if (user) {
              fetchVendorListings(user._id);
              setNotification({
                type: 'success',
                message: 'Listings refreshed successfully!'
              });
            }
          };

          // Calculate booking statistics
          const getActiveBookings = () => {
            return bookings.filter(booking => 
              ['pending', 'confirmed', 'in-progress'].includes(booking.status)
            ).length;
          };

          const getTotalEarnings = () => {
            return bookings
              .filter(booking => booking.paymentStatus === 'paid')
              .reduce((total, booking) => total + booking.totalAmount, 0);
          };

          const getPendingPayments = () => {
            return bookings
              .filter(booking => booking.paymentStatus === 'pending')
              .reduce((total, booking) => total + booking.totalAmount, 0);
          };

  // Listen for navigation events to refresh listings
  useEffect(() => {
    const handleFocus = () => {
      refreshListings();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  if (!user) return <div className="vendor-dashboard-bg"><div className="vendor-dashboard-container"><h2>Please sign in to view your dashboard.</h2></div></div>;

  return (
    <div className="vendor-dashboard-bg">
      {/* Navigation Header */}
      <nav className="vendor-dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Utshob</span>
        </div>
        <div className="nav-user">
          <span className="user-greeting">Welcome, {user.name}!</span>
          <span className="user-role">Vendor</span>
          <button className="signout-btn" onClick={handleSignOut}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </nav>

      <div className="vendor-dashboard-container">
        {/* Notification */}
        {notification && (
          <div className={`dashboard-notification ${notification.type}`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>✕</button>
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span> Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <span>📋</span> My Listings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'works' ? 'active' : ''}`}
            onClick={() => setActiveTab('works')}
          >
            <span>🔨</span> Upcoming Works
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Vendor Profile Section */}
              <div className="vendor-profile-section">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p className="vendor-role">Professional Vendor</p>
                    <p className="vendor-status">Active</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <div className="detail-content">
                      <label>Email</label>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📱</span>
                    <div className="detail-content">
                      <label>Phone</label>
                      <span>{user.number}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <div className="detail-content">
                      <label>Address</label>
                      <span>{user.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <h3>{listings.length}</h3>
                    <p>Active Listings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h3>{getActiveBookings()}</h3>
                    <p>Upcoming Works</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h3>0</h3>
                    <p>Total Reviews</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h3>৳{getTotalEarnings()}</h3>
                    <p>Total Earnings</p>
                  </div>
                </div>
              </div>

              {/* Action Sections */}
              <div className="action-sections">
                <div className="add-listing-section">
                  <h3>📝 Add New Listing</h3>
                  <div className="listing-content">
                    <p>Create a new service listing to attract more customers</p>
                    <button className="add-listing-btn" onClick={handleAddListing}>
                      <span>➕</span> Add a Listing
                    </button>
                  </div>
                </div>

                <div className="upcoming-works-section">
                  <h3>🔨 Upcoming Works</h3>
                  <div className="works-content">
                    {bookingsLoading ? (
                      <div className="loading-works">
                        <span>🔄</span>
                        <p>Loading bookings...</p>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="no-works">
                        <span>📭</span>
                        <p>No upcoming works</p>
                        <small>Bookings will appear here when customers book your services</small>
                      </div>
                    ) : (
                      <div className="works-list">
                        {bookings.slice(0, 3).map(booking => (
                          <div key={booking._id} className="work-item">
                            <div className="work-info">
                              <h4>{booking.serviceName}</h4>
                              <span className="work-category">{booking.serviceCategory}</span>
                            </div>
                            <div className="work-details">
                              <span className="customer-name">Customer: {booking.customerName}</span>
                              <span className="work-status">
                                <span className={`status-badge ${booking.status}`}>
                                  {booking.status}
                                </span>
                              </span>
                            </div>
                            <div className="work-price">
                              <span>৳{booking.servicePrice}</span>
                            </div>
                          </div>
                        ))}
                        {bookings.length > 3 && (
                          <div className="more-works">
                            <span>+{bookings.length - 3} more bookings</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="listings-tab">
              <div className="listings-header">
                <h2>📋 My Service Listings</h2>
                <p>Manage your service offerings and attract customers</p>
                <div className="listings-header-buttons">
                  <button className="refresh-btn" onClick={refreshListings}>
                    <span>🔄</span> Refresh
                  </button>
                  <button className="add-listing-btn-large" onClick={handleAddListing}>
                    <span>➕</span> Add New Listing
                  </button>
                </div>
              </div>
              
              <div className="listings-content">
                {listingsLoading ? (
                  <div className="listings-loading">
                    <div className="loading-spinner">🔄</div>
                    <p>Loading your listings...</p>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="no-listings">
                    <div className="no-listings-icon">📭</div>
                    <h3>No listings yet</h3>
                    <p>Start by adding your first service listing to attract customers</p>
                    <button className="add-first-listing-btn" onClick={handleAddListing}>
                      <span>➕</span> Create Your First Listing
                    </button>
                  </div>
                ) : (
                  <div className="listings-grid">
                    {listings.map((listing, index) => (
                      <div key={index} className="listing-card">
                        <div className="listing-header">
                          <h4>{listing.organizationName}</h4>
                          <span className={`listing-status ${listing.availability === 'Yes' ? 'active' : 'inactive'}`}>
                            {listing.availability}
                          </span>
                        </div>
                        <p className="listing-category">{listing.category}</p>
                        <p className="listing-description">{listing.description}</p>
                                                 <div className="listing-photo">
                           <img src={listing.photo || DEFAULT_SERVICE_IMAGE} alt={listing.organizationName} />
                         </div>
                        <div className="listing-footer">
                          <span className="listing-price">৳{listing.price}</span>
                          <button className="edit-listing-btn">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'works' && (
            <div className="works-tab">
              <div className="works-header">
                <h2>🔨 Upcoming Works</h2>
                <p>Track your scheduled work and customer bookings</p>
              </div>
              
              <div className="works-content">
                <div className="no-works">
                  <div className="no-works-icon">📭</div>
                  <h3>No upcoming works</h3>
                  <p>When customers book your services, they will appear here</p>
                  <small>Focus on creating great listings to attract customers</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
