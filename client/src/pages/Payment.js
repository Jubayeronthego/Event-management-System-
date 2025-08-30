import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');

  const banks = [
    'BRAC Bank',
    'City Bank',
    'One Bank',
    'SouthEast Bank',
    'Dutch Bangla Bank',
    'Eastern Bank',
    'Prime Bank',
    'Standard Bank'
  ];

  const mobileProviders = [
    'Bkash',
    'Nagad',
    'Rocket',
    'Upay',
    'Tap'
  ];

  useEffect(() => {
    const userData = localStorage.getItem('utshob_user');
    if (!userData) {
      navigate('/signin');
      return;
    }

    const user = JSON.parse(userData);
    fetchPendingPayments(user._id);
  }, [navigate]);

  const fetchPendingPayments = async (userId) => {
    try {
      const response = await axios.get(`/api/payments/pending/${userId}`);
      setPaymentData(response.data);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    setSelectedProvider('');
    setCardNumber('');
    setMobileNumber('');
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      setCardNumber(value);
    }
  };

  const handleMobileNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setMobileNumber(value);
    }
  };

  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };

  const processPayment = async () => {
    if (!selectedMethod || !selectedProvider || !amount) {
      showNotificationMessage('Please fill in all required fields', 'error');
      return;
    }

    if (selectedMethod === 'bank' && cardNumber.length !== 14) {
      showNotificationMessage('Card number must be 14 digits', 'error');
      return;
    }

    if (selectedMethod === 'mobile_banking' && mobileNumber.length !== 11) {
      showNotificationMessage('Mobile number must be 11 digits', 'error');
      return;
    }

    setProcessing(true);

    try {
      const userData = JSON.parse(localStorage.getItem('utshob_user'));
      
      const paymentPayload = {
        userId: userData._id,
        paymentMethod: selectedMethod,
        paymentProvider: selectedProvider,
        cardNumber: selectedMethod === 'bank' ? cardNumber : null,
        mobileNumber: selectedMethod === 'mobile_banking' ? mobileNumber : null,
        amount: parseInt(amount),
        requiredAmount: paymentData.totalDue,
        services: paymentData.services
      };

      const response = await axios.post('/api/payments/process', paymentPayload);
      
                    if (response.data.paymentStatus === 'successful') {
                showNotificationMessage('Your Payment is Successful!!!', 'success');
                // Redirect to reviews page after successful payment
                setTimeout(() => {
                  navigate('/reviews-and-ratings', { 
                    state: { services: paymentData.services } 
                  });
                }, 2000);
              } else {
                showNotificationMessage('Payment unsuccessful', 'error');
              }
    } catch (error) {
      console.error('Payment error:', error);
      showNotificationMessage('Payment failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (!paymentData || paymentData.count === 0) {
    return (
      <div className="payment-page">
        <div className="no-payments">
          <div className="no-payments-icon">💰</div>
          <h2>No Pending Payments</h2>
          <p>You don't have any pending payments at the moment.</p>
          <button className="back-btn" onClick={goBackToDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      {/* Notification */}
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notificationType === 'success' ? '✅' : '❌'}
            </span>
            <span className="notification-message">{notificationMessage}</span>
          </div>
        </div>
      )}

      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <h1>💳 Payment Gateway</h1>
          <p>Complete your payment to confirm your bookings</p>
        </div>

        {/* Payment Summary */}
        <div className="payment-summary">
          <h2>Payment Summary</h2>
          <div className="summary-content">
            <div className="summary-item">
              <span className="label">Total Due:</span>
              <span className="amount">৳{paymentData.totalDue}</span>
            </div>
            <div className="summary-item">
              <span className="label">Services:</span>
              <span className="count">{paymentData.count} service(s)</span>
            </div>
          </div>
          
          <div className="services-list">
            <h3>Services to Pay:</h3>
            {paymentData.services.map((service, index) => (
              <div key={index} className="service-item">
                <span className="service-name">{service.serviceName}</span>
                <span className="service-price">৳{service.servicePrice}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="payment-methods">
          <h2>Choose Payment Method</h2>
          
          <div className="method-options">
            <button
              className={`method-btn ${selectedMethod === 'mobile_banking' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodSelect('mobile_banking')}
            >
              <span className="method-icon">📱</span>
              <span className="method-text">Mobile Banking</span>
            </button>
            
            <button
              className={`method-btn ${selectedMethod === 'bank' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodSelect('bank')}
            >
              <span className="method-icon">🏦</span>
              <span className="method-text">Bank</span>
            </button>
          </div>
        </div>

        {/* Provider Selection */}
        {selectedMethod && (
          <div className="provider-selection">
            <h3>Select {selectedMethod === 'mobile_banking' ? 'Mobile Banking' : 'Bank'}</h3>
            
            <div className="provider-grid">
              {(selectedMethod === 'mobile_banking' ? mobileProviders : banks).map((provider) => (
                <button
                  key={provider}
                  className={`provider-btn ${selectedProvider === provider ? 'active' : ''}`}
                  onClick={() => handleProviderSelect(provider)}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Payment Details Form */}
        {selectedMethod && selectedProvider && (
          <div className="payment-form">
            <h3>Payment Details</h3>
            
            <div className="form-group">
              <label>
                {selectedMethod === 'bank' ? 'Card Number (14 digits)' : 'Mobile Number (11 digits)'}
              </label>
              <input
                type="text"
                value={selectedMethod === 'bank' ? cardNumber : mobileNumber}
                onChange={selectedMethod === 'bank' ? handleCardNumberChange : handleMobileNumberChange}
                placeholder={selectedMethod === 'bank' ? '12345678901234' : '01XXXXXXXXX'}
                maxLength={selectedMethod === 'bank' ? 14 : 11}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Amount to Pay</label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder={`৳${paymentData.totalDue}`}
                className="form-input"
              />
              <small className="form-help">
                Required amount: ৳{paymentData.totalDue}
              </small>
            </div>

            <div className="form-actions">
              <button
                className="process-payment-btn"
                onClick={processPayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner-small"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    Process Payment
                  </>
                )}
              </button>
              
              <button className="back-btn" onClick={goBackToDashboard}>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
