import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    const userData = localStorage.getItem('utshob_user');
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        // Redirect vendors to vendor dashboard
        if (userObj.role === 'vendor') {
          navigate('/vendor-dashboard');
          return;
        }
        // Redirect admins to admin dashboard
        if (userObj.role === 'admin') {
          navigate('/admin-dashboard');
          return;
        }
        setUser(userObj);
        
        // Fetch user's bookings
        fetchUserBookings(userObj._id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('utshob_user');
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const fetchUserBookings = async (userId) => {
    try {
      const response = await axios.get(`/api/bookings/customer/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Don't fail completely if bookings can't be fetched
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('utshob_user');
    navigate('/');
  };

  const handlePayNow = () => {
    navigate('/payment');
  };

  const handleLookForServices = () => {
    navigate('/services');
  };

  // Calculate booking statistics
  const getActiveBookings = () => {
    return bookings.filter(booking => 
      ['pending', 'confirmed', 'in-progress'].includes(booking.status)
    ).length;
  };

  const getTotalDue = () => {
    return bookings
      .filter(booking => booking.paymentStatus === 'pending')
      .reduce((total, booking) => total + booking.totalAmount, 0);
  };

  const getTotalPaid = () => {
    return bookings
      .filter(booking => booking.paymentStatus === 'paid')
      .reduce((total, booking) => total + booking.totalAmount, 0);
  };

  // Get pending bookings (for payment and active display)
  const getPendingBookings = () => {
    return bookings.filter(booking => booking.paymentStatus === 'pending');
  };

  // Get completed/paid bookings
  const getCompletedBookings = () => {
    return bookings.filter(booking => booking.paymentStatus === 'paid');
  };

  const getBalance = () => {
    return getTotalDue() - getTotalPaid();
  };

  if (!user) return <div className="dashboard-bg"><div className="dashboard-container"><h2>Please sign in to view your dashboard.</h2></div></div>;



  return (
    <div className="dashboard-bg">
      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Utshob</span>
        </div>
        <div className="nav-user">
          <span className="user-greeting">Welcome, {user.name}!</span>
          <span className="user-role">{user.role}</span>
          <button className="refresh-btn" onClick={() => fetchUserBookings(user._id)}>
            <span>🔄</span> Refresh
          </button>
          <button className="signout-btn" onClick={handleSignOut}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span> Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <span>📅</span> My Bookings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* User Profile Section */}
              <div className="user-profile-section">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p className="user-role">{user.role}</p>
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
                <div className="stat-card clickable" onClick={() => navigate('/total-bookings')}>
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h3>{bookings.length}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h3>৳{getTotalDue()}</h3>
                    <p>Total Due</p>
                  </div>
                </div>
              </div>

              {/* Action Sections */}
              <div className="action-sections">
                <div className="booking-status-section">
                  <h3>Booking Status</h3>
                  <div className="status-content">
                    {loading ? (
                      <div className="loading-bookings">
                        <span>🔄</span>
                        <p>Loading bookings...</p>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="no-bookings">
                        <span>📭</span>
                        <p>No active bookings</p>
                        <small>Book a service to see your status here</small>
                      </div>
                    ) : getPendingBookings().length > 0 ? (
                      <div className="bookings-status-list">
                        {getPendingBookings().slice(0, 3).map(booking => (
                          <div key={booking._id} className="booking-status-card">
                            <div className="booking-status-header">
                              <h4 className="booking-status-title">{booking.serviceName}</h4>
                              <span className="booking-status-price">৳{booking.servicePrice}</span>
                            </div>
                            <div className="booking-status-details">
                              <span className={`booking-status-badge ${booking.paymentStatus}`}>
                                {booking.paymentStatus}
                              </span>
                              <div className="booking-status-progress">
                                <span>Payment</span>
                                <div className="progress-bar">
                                  <div className={`progress-fill ${booking.paymentStatus}`}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {getPendingBookings().length > 3 && (
                          <div className="more-bookings">
                            <span>+{getPendingBookings().length - 3} more pending</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-bookings">
                        <span>✅</span>
                        <p>All payments completed!</p>
                        <small>No pending payments at the moment</small>
                      </div>
                    )}
                  </div>
                </div>

                <div className="services-section">
                  <h3>🔍 Look for Services</h3>
                  <div className="services-content">
                    <p>Discover amazing event services for your celebrations</p>
                    <button className="look-services-btn" onClick={handleLookForServices}>
                      <span>🔍</span> Browse Services
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              {getTotalDue() > 0 && (
                <div className="payment-section">
                  <h3>💳 Payment Summary</h3>
                  <div className="payment-content">
                    <div className="payment-details">
                      <div className="payment-item">
                        <span>Total Due</span>
                        <span className="amount">৳{getTotalDue()}</span>
                      </div>
                    </div>
                    <button className="pay-now-btn" onClick={handlePayNow}>
                      <span>💳</span> Pay Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <div className="bookings-header">
                <h2>📅 My Bookings</h2>
                <p>Track your event bookings and their status</p>
              </div>
              
              <div className="bookings-content">
                {loading ? (
                  <div className="loading-bookings">
                    <div className="loading-spinner">🔄</div>
                    <p>Loading your bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="no-bookings">
                    <div className="no-bookings-icon">📭</div>
                    <h3>No bookings yet</h3>
                    <p>Start by booking a service from the services page</p>
                    <button className="browse-services-btn" onClick={handleLookForServices}>
                      <span>🔍</span> Browse Services
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Pending Bookings Section */}
                    {getPendingBookings().length > 0 && (
                      <div className="bookings-section">
                        <h3 className="section-title">⏳ Pending Payments</h3>
                        <div className="bookings-simple-list">
                          {getPendingBookings().map((booking, index) => (
                            <div key={booking._id} className="booking-simple-item">
                              <div className="booking-vendor">
                                <span className="vendor-icon">👤</span>
                                <span className="vendor-name">{booking.vendorName}</span>
                              </div>
                              <div className="booking-service">
                                <span className="service-icon">🏷️</span>
                                <span className="service-name">{booking.serviceName}</span>
                              </div>
                              <div className="booking-action">
                                <button 
                                  className="pay-now-btn-simple"
                                  onClick={() => navigate('/payment')}
                                >
                                  <span>💳</span> Pay Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completed Bookings Section */}
                    {getCompletedBookings().length > 0 && (
                      <div className="bookings-section">
                        <h3 className="section-title">✅ Completed Bookings</h3>
                        <div className="bookings-simple-list">
                          {getCompletedBookings().map((booking, index) => (
                            <div key={booking._id} className="booking-simple-item completed">
                              <div className="booking-vendor">
                                <span className="vendor-icon">👤</span>
                                <span className="vendor-name">{booking.vendorName}</span>
                              </div>
                              <div className="booking-service">
                                <span className="service-icon">🏷️</span>
                                <span className="service-name">{booking.serviceName}</span>
                              </div>
                              <div className="booking-action">
                                <span className="payment-status-simple paid">Paid</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No bookings message if both sections are empty */}
                    {getPendingBookings().length === 0 && getCompletedBookings().length === 0 && (
                      <div className="no-bookings">
                        <div className="no-bookings-icon">📭</div>
                        <h3>No bookings found</h3>
                        <p>Start by booking a service from the services page</p>
                        <button className="browse-services-btn" onClick={handleLookForServices}>
                          <span>🔍</span> Browse Services
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;