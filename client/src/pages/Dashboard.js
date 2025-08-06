import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('utshob_user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('utshob_user');
    navigate('/');
  };

  const handlePayNow = () => {
    // TODO: Implement payment page navigation
    alert('Payment functionality will be implemented soon!');
  };

  const handleLookForServices = () => {
    navigate('/services');
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
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h3>0</h3>
                    <p>Active Bookings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h3>৳0</h3>
                    <p>Total Due</p>
                  </div>
                </div>
              </div>

              {/* Action Sections */}
              <div className="action-sections">
                <div className="booking-status-section">
                  <h3>📋 Booking Status</h3>
                  <div className="status-content">
                    <div className="no-bookings">
                      <span>📭</span>
                      <p>No active bookings</p>
                      <small>Book a service to see your status here</small>
                    </div>
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
              <div className="payment-section">
                <h3>💳 Payment Summary</h3>
                <div className="payment-content">
                  <div className="payment-details">
                    <div className="payment-item">
                      <span>Total Due:</span>
                      <span className="amount">৳0</span>
                    </div>
                    <div className="payment-item">
                      <span>Paid:</span>
                      <span className="amount paid">৳0</span>
                    </div>
                    <div className="payment-item total">
                      <span>Balance:</span>
                      <span className="amount balance">৳0</span>
                    </div>
                  </div>
                  <button className="pay-now-btn" onClick={handlePayNow}>
                    <span>💳</span> Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <div className="bookings-header">
                <h2>📅 My Bookings</h2>
                <p>Track your event bookings and their status</p>
              </div>
              
              <div className="bookings-content">
                <div className="no-bookings">
                  <div className="no-bookings-icon">📭</div>
                  <h3>No bookings yet</h3>
                  <p>Start by booking a service from the services page</p>
                  <button className="browse-services-btn" onClick={handleLookForServices}>
                    <span>🔍</span> Browse Services
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;