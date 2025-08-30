import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/users/login', form);
      localStorage.setItem('utshob_user', JSON.stringify(res.data));
      
      // Redirect based on user role
      if (res.data.role === 'vendor') {
        navigate('/vendor-dashboard');
      } else if (res.data.role === 'admin') {
        navigate('/admin-dashboard'); // Admin users go to admin dashboard
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="signin-bg">
      <div className="signin-overlay"></div>
      
      {/* Navigation */}
      <nav className="signin-nav">
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
      <div className="signin-container">
        <div className="signin-content">
          <div className="signin-header">
            <h1>Welcome Back to Utshob</h1>
            <p>Sign in to continue planning your perfect events</p>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>
            {error && <div className="signin-error">{error}</div>}
            
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
            
            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your password" 
                  value={form.password} 
                  onChange={handleChange} 
                  required 
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
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className="signin-footer">
              Don't have an account? <Link to="/signup" className="link-btn">Create Account</Link>
            </div>
          </form>
        </div>

        {/* Side Panel */}
        <div className="signin-side">
          <div className="side-content">
            <div className="side-icon">🎉</div>
            <h2>Welcome Back!</h2>
            <p>We're excited to see you again. Continue your journey of creating amazing events with Utshob.</p>
            
            <div className="side-features">
              <div className="side-feature">
                <span className="feature-icon">📅</span>
                <span>Manage Your Events</span>
              </div>
              <div className="side-feature">
                <span className="feature-icon">🎨</span>
                <span>Book Services</span>
              </div>
              <div className="side-feature">
                <span className="feature-icon">⭐</span>
                <span>Track Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;