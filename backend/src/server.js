const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const pollRoutes = require('./routes/polls');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tech_polls_testing';

// Enable CORS for all origins to ensure frontend connectivity
app.use(cors({
  origin: function(origin, callback) {
    // Allow any origin for now to debug connections
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/comments', commentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Tech Polls API is running!');
});

// Connect to MongoDB directly in server.js for better control
console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:');
    console.error(err.message);
    process.exit(1);
  });
