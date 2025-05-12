
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Get database URI from environment or use local fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tech_polls_testing';


const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');
  console.log(`Connection URI: ${MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
  
  try {
    // Use simple connection without deprecated options
    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:');
    console.error(error.message);
    
    // Exit process with failure
    process.exit(1);
  }
};

// Export using CommonJS for maximum compatibility
module.exports = connectDB;
