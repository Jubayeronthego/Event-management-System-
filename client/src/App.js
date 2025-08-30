import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AddListing from './pages/AddListing';
import Services from './pages/Services';
import Payment from './pages/Payment';
import TotalBookings from './pages/TotalBookings';
import ReviewsAndRatings from './pages/ReviewsAndRatings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/services" element={<Services />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/total-bookings" element={<TotalBookings />} />
        <Route path="/reviews-and-ratings" element={<ReviewsAndRatings />} />
      </Routes>
    </Router>
  );
}

export default App;
