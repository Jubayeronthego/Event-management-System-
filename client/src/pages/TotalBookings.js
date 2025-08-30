import React, { useState, useEffect } from 'react';
import './TotalBookings.css';

const TotalBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'completed': return '#6f42c1';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };





  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading Bookings...</h2>
        <p>Please wait while we fetch your booking information</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Bookings</h2>
        <p>{error}</p>
        <button onClick={fetchBookings} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="total-bookings-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1>Total Bookings</h1>
          <p>Manage and track all your service bookings in one place</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.paymentStatus === 'paid').length}
            </div>
            <div className="stat-label">Paid</div>
          </div>
        </div>
      </div>



      {/* Bookings List */}
      <div className="bookings-section">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📋</div>
            <h3>No Bookings Found</h3>
            <p>You don't have any bookings yet</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <div className="booking-main">
                  <div className="booking-info">
                    <div className="service-name">{booking.serviceName || 'N/A'}</div>
                    <div className="vendor-name">by {booking.vendorName || 'N/A'}</div>
                    <div className="booking-date">
                      {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="booking-amount">
                    <span className="amount">৳{booking.totalAmount || 'N/A'}</span>
                    <div className="status-badge" style={{backgroundColor: getStatusColor(booking.status)}}>
                      {booking.status || 'pending'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalBookings;
