import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', number: '', address: '', role: 'customer' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('/api/users/signup', form);
      setSuccess(res.data.msg);
      setForm({ name: '', email: '', password: '', number: '', address: '', role: 'customer' });
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="signup-bg">
      <div className="signup-overlay"></div>
      
      {/* Navigation */}
      <nav className="signup-nav">
        <Link to="/" className="nav-back">
          <span>←</span>
          <span>Back to Home</span>
        </Link>
        <div className="nav-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Utshob</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-header">
            <h1>Create Your Utshob Account</h1>
            <p>Join thousands of users celebrating their events with Utshob</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            {error && <div className="signup-error">{error}</div>}
            {success && <div className="signup-success">{success} - Redirecting to Sign In...</div>}
            
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="password-field">
                  <input 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Create a password" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                    minLength={6} 
                  />
                  <button 
                    type="button" 
                    className="show-hide-btn" 
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Account Type</label>
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange} 
                  required
                  className="role-select"
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  name="number" 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  value={form.number} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea 
                  name="address" 
                  placeholder="Enter your address" 
                  value={form.address} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div className="signup-footer">
              Already have an account? <Link to="/signin" className="link-btn">Sign In</Link>
            </div>
          </form>
        </div>

        {/* Side Panel */}
        <div className="signup-side">
          <div className="side-content">
            <div className="side-icon">🎉</div>
            <h2>Welcome to Utshob</h2>
            <p>Your journey to creating unforgettable events starts here. Join our community of event planners and service providers.</p>
            
            <div className="side-features">
              <div className="side-feature">
                <span className="feature-icon">✨</span>
                <span>Easy Event Planning</span>
              </div>
              <div className="side-feature">
                <span className="feature-icon">🎨</span>
                <span>Professional Services</span>
              </div>
              <div className="side-feature">
                <span className="feature-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;