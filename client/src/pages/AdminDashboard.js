import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorDetails, setVendorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('utshob_user');
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        if (userObj.role !== 'admin') {
          navigate('/dashboard');
          return;
        }
        setUser(userObj);
        fetchData();
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('utshob_user');
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [customersRes, vendorsRes] = await Promise.all([
        axios.get('/api/users?role=customer'),
        axios.get('/api/users?role=vendor')
      ]);
      setCustomers(customersRes.data);
      setVendors(vendorsRes.data);
      
      // Fetch vendor details including ratings and reviews
      await fetchVendorDetails(vendorsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDetails = async (vendorsList) => {
    try {
      const details = {};
      for (const vendor of vendorsList) {
        try {
          const [ratingsRes, reviewsRes] = await Promise.all([
            axios.get(`/api/ratings/vendor/${vendor._id}`),
            axios.get(`/api/reviews/vendor/${vendor._id}`)
          ]);
          
          console.log(`Vendor ${vendor.name} ratings data:`, ratingsRes.data);
          console.log(`Vendor ${vendor.name} reviews data:`, reviewsRes.data);
          
          details[vendor._id] = {
            ratings: ratingsRes.data.ratings || [],
            averageRating: ratingsRes.data.averageRating || 0,
            totalRatings: ratingsRes.data.totalRatings || 0,
            reviews: reviewsRes.data
          };
        } catch (error) {
          console.error(`Error fetching details for vendor ${vendor._id}:`, error);
          details[vendor._id] = { ratings: [], averageRating: 0, totalRatings: 0, reviews: [] };
        }
      }
      setVendorDetails(details);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    }
  };

  const handleDeleteUser = (userId, userType, userName) => {
    setDeleteTarget({ userId, userType, userName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(deleteTarget.userId);
      await axios.delete(`/api/users/${deleteTarget.userId}`);
      
      // Remove from local state
      if (deleteTarget.userType === 'customer') {
        setCustomers(customers.filter(c => c._id !== deleteTarget.userId));
      } else {
        setVendors(vendors.filter(v => v._id !== deleteTarget.userId));
      }
      
      if (deleteTarget.userType === 'vendor') {
        alert(`${deleteTarget.userType} deleted successfully. All their service listings, bookings, reviews, and ratings have also been removed.`);
      } else {
        alert(`${deleteTarget.userType} deleted successfully. All their bookings, reviews, and ratings have also been removed.`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setDeleteLoading(null);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };



  const handleSignOut = () => {
    localStorage.removeItem('utshob_user');
    navigate('/');
  };

  // Filter users (no search functionality)
  const filteredCustomers = customers;
  const filteredVendors = vendors;

  // Auto-scrolling reviews component
  const AutoScrollingReviews = ({ reviews, vendorId }) => {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    
    useEffect(() => {
      if (reviews.length <= 1) return;
      
      const interval = setInterval(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
      }, 4000); // Change review every 4 seconds
      
      return () => clearInterval(interval);
    }, [reviews.length]);
    
    if (!reviews || reviews.length === 0) {
      return (
        <div className="no-reviews">
          <span>📝</span>
          <p>No reviews yet</p>
        </div>
      );
    }
    
    const currentReview = reviews[currentReviewIndex];
    
    return (
      <div className="reviews-section">
        <div className="reviews-header">
          <h4>📝 Customer Reviews ({reviews.length})</h4>
          <div className="review-indicators">
            {reviews.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentReviewIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
        <div className="review-content">
          <div className="review-text">"{currentReview.comment}"</div>
          <div className="review-author">- {currentReview.customerName}</div>
          <div className="review-date">
            {new Date(currentReview.reviewDate || currentReview.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  };

  if (!user) return <div className="admin-dashboard-bg"><div className="admin-dashboard-container"><h2>Loading...</h2></div></div>;

  return (
    <div className="admin-dashboard-bg">
      {/* Navigation Header */}
      <nav className="admin-dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Utshob Admin</span>
        </div>
        <div className="nav-user">
                     <span className="user-greeting">Welcome, {user.name}!</span>
           <span className="admin-badge">Admin</span>
 
           <button className="signout-btn" onClick={handleSignOut}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </nav>

      <div className="admin-dashboard-container">
        {/* Admin Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{customers.length}</h3>
              <p>Total Customers</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <h3>{vendors.length}</h3>
              <p>Total Vendors</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{customers.length + vendors.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>

        

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <span>👥</span> Customers ({filteredCustomers.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            <span>🏢</span> Vendors ({filteredVendors.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'customers' && (
            <div className="customers-tab">
              <div className="tab-header">
                <h2>👥 Customer Management</h2>
                <p>View and manage all customer accounts</p>
              </div>
              
                             {loading ? (
                 <div className="loading-container">
                   <p>Loading customers...</p>
                 </div>
                             ) : filteredCustomers.length === 0 ? (
                 <div className="no-data">
                   <div className="no-data-icon">📭</div>
                   <h3>No customers found</h3>
                   <p>No customer accounts have been created yet.</p>
                 </div>
              ) : (
                <div className="users-grid">
                  {filteredCustomers.map((customer) => (
                    <div key={customer._id} className="user-card customer-card">
                      <div className="user-header">
                        <div className="user-avatar">
                          <span>{customer.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="user-info">
                          <h3>{customer.name}</h3>
                          <span className="user-role customer-role">Customer</span>
                        </div>
                        <div className="user-actions">
                                                                                 <button 
                              className="delete-btn"
                              onClick={() => handleDeleteUser(customer._id, 'customer', customer.name)}
                              disabled={deleteLoading === customer._id}
                            >
                             {deleteLoading === customer._id ? 'Loading...' : '🗑️'}
                           </button>
                        </div>
                      </div>
                      
                      <div className="user-details">
                        <div className="detail-row">
                          <span className="detail-label">📧 Email:</span>
                          <span className="detail-value">{customer.email}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📱 Phone:</span>
                          <span className="detail-value">{customer.number}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📍 Address:</span>
                          <span className="detail-value">{customer.address}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📅 Joined:</span>
                          <span className="detail-value">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="vendors-tab">
              <div className="tab-header">
                <h2>🏢 Vendor Management</h2>
                <p>View and manage all vendor accounts</p>
              </div>
              
                             {loading ? (
                 <div className="loading-container">
                   <p>Loading vendors...</p>
                 </div>
                             ) : filteredVendors.length === 0 ? (
                 <div className="no-data">
                   <div className="no-data-icon">📭</div>
                   <h3>No vendors found</h3>
                   <p>No vendor accounts have been created yet.</p>
                 </div>
              ) : (
                <div className="users-grid">
                  {filteredVendors.map((vendor) => (
                    <div key={vendor._id} className="user-card vendor-card">
                      <div className="user-header">
                        <div className="user-avatar vendor-avatar">
                          <span>{vendor.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="user-info">
                          <h3>{vendor.name}</h3>
                          <span className="user-role vendor-role">Vendor</span>
                        </div>
                        <div className="user-actions">
                                                                                 <button 
                              className="delete-btn"
                              onClick={() => handleDeleteUser(vendor._id, 'vendor', vendor.name)}
                              disabled={deleteLoading === vendor._id}
                            >
                             {deleteLoading === vendor._id ? 'Loading...' : '🗑️'}
                           </button>
                        </div>
                      </div>
                      
                                             <div className="user-details">
                         <div className="detail-row">
                           <span className="detail-label">📧 Email:</span>
                           <span className="detail-value">{vendor.email}</span>
                         </div>
                         <div className="detail-row">
                           <span className="detail-label">📱 Phone:</span>
                           <span className="detail-value">{vendor.number}</span>
                         </div>
                         <div className="detail-row">
                           <span className="detail-label">📍 Address:</span>
                           <span className="detail-value">{vendor.address}</span>
                         </div>
                         <div className="detail-row">
                           <span className="detail-label">📅 Joined:</span>
                           <span className="detail-value">
                             {new Date(vendor.createdAt).toLocaleDateString()}
                           </span>
                         </div>
                         
                         {/* Ratings Section */}
                         <div className="ratings-section">
                                                    <div className="ratings-header">
                           <h4>⭐ Ratings & Reviews</h4>
                           {vendorDetails[vendor._id]?.reviews && (
                             <span className="reviews-count">
                               {vendorDetails[vendor._id].reviews.length} reviews
                             </span>
                           )}
                         </div>
                                                       {!vendorDetails[vendor._id] ? (
                              <div className="loading-ratings">
                                <p>Loading ratings...</p>
                              </div>
                            ) : vendorDetails[vendor._id].totalRatings > 0 ? (
                              <div className="ratings-summary">
                                <div className="average-rating">
                                  <span className="rating-number">
                                    {vendorDetails[vendor._id].averageRating}
                                  </span>
                                  <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                                  <span className="total-ratings">({vendorDetails[vendor._id].totalRatings} ratings)</span>
                                </div>
                              </div>
                            ) : (
                              <div className="no-ratings">
                                <span>⭐</span>
                                <p>No ratings yet</p>
                              </div>
                            )}
                           
                           {/* Auto-scrolling Reviews */}
                           <AutoScrollingReviews 
                             reviews={vendorDetails[vendor._id]?.reviews || []} 
                             vendorId={vendor._id}
                           />
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Delete Account</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>{deleteTarget?.userName}</strong>'s account?
              </p>
                             <p className="warning-text">
                 This action cannot be undone. All data associated with this account will be permanently removed.
               </p>
               {deleteTarget?.userType === 'vendor' && (
                 <p className="info-text">
                   <strong>Note:</strong> Deleting this vendor will also remove all their service listings, bookings, reviews, and ratings from the system.
                 </p>
               )}
               {deleteTarget?.userType === 'customer' && (
                 <p className="info-text">
                   <strong>Note:</strong> Deleting this customer will also remove all their bookings, reviews, and ratings from the system.
                 </p>
               )}
            </div>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel-btn" 
                onClick={cancelDelete}
                disabled={deleteLoading}
              >
                No, Cancel
              </button>
              <button 
                className="modal-btn delete-confirm-btn" 
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
