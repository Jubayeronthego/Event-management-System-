import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem('utshob_user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="landing-bg">
      <div className="landing-overlay"></div>
      
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Utshob</span>
        </div>
        <div className="nav-actions">
          <Link to="/signin" className="nav-btn nav-btn-secondary">Sign In</Link>
          <Link to="/signup" className="nav-btn nav-btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Create Your Own</span>
            <span className="title-highlight">Utshob</span>
            <span className="title-line">and Celebrate!</span>
          </h1>
          <p className="hero-subtitle">
            Transform your events into unforgettable celebrations with our comprehensive event management platform
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="hero-btn hero-btn-primary">
              <span>Start Planning</span>
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/signin" className="hero-btn hero-btn-outline">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎉</div>
            <h3>Event Planning</h3>
            <p>Comprehensive event planning tools to make your celebrations perfect</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Decoration Services</h3>
            <p>Professional decoration services to transform your venue</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Photography</h3>
            <p>Capture every moment with our professional photography services</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Catering</h3>
            <p>Delicious catering options to satisfy all your guests</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <h3>Entertainment</h3>
            <p>Live music and entertainment to keep your event lively</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Transportation</h3>
            <p>Reliable transportation services for your guests</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Events Planned</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Service Providers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Create Your Perfect Event?</h2>
          <p>Join thousands of users who trust Utshob for their celebrations</p>
          <Link to="/signup" className="cta-btn">
            <span>Create Your Account</span>
            <span className="btn-icon">🎉</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">🎉</span>
            <span className="brand-text">Utshob</span>
          </div>
          <div className="footer-links">
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Utshob. Making celebrations memorable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;