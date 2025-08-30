const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Utshob';

console.log('Connecting to MongoDB:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected to database:', MONGODB_URI);
  console.log('Database name:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.log('MongoDB Connection Error:', err);
  process.exit(1);
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'MERN Stack API is working!',
    database: mongoose.connection.db.databaseName
  });
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/services', require('./routes/api/services'));
app.use('/api/bookings', require('./routes/api/bookings'));
app.use('/api/payments', require('./routes/api/payments'));
app.use('/api/reviews', require('./routes/api/reviews'));
app.use('/api/ratings', require('./routes/api/ratings'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 