import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [apiMessage, setApiMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/test');
      setApiMessage(response.data.message);
    } catch (error) {
      setApiMessage('Error connecting to API: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="home">
      <div className="home-container">
        <h1>Welcome to MERN Stack Application</h1>
        <p>This is a full-stack web application built with:</p>
        <ul>
          <li><strong>M</strong>ongoDB - Database</li>
          <li><strong>E</strong>xpress.js - Backend framework</li>
          <li><strong>R</strong>eact.js - Frontend library</li>
          <li><strong>N</strong>ode.js - Runtime environment</li>
        </ul>
        
        <div className="api-test">
          <h2>API Connection Test</h2>
          <button onClick={testAPI} disabled={loading}>
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
          {apiMessage && (
            <div className="api-message">
              <strong>Response:</strong> {apiMessage}
            </div>
          )}
        </div>

        <div className="features">
          <h2>Features</h2>
          <ul>
            <li>✅ Express.js server with MongoDB connection</li>
            <li>✅ React frontend with routing</li>
            <li>✅ API proxy configuration</li>
            <li>✅ Environment variables setup</li>
            <li>✅ Concurrent development server</li>
            <li>✅ Production build configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home; 