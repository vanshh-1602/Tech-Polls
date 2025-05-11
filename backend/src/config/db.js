const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Format the MongoDB connection string properly
let mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tech_polls_testing';

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Using the simplified connection without deprecated options
    await mongoose.connect(mongoDBUri);
    console.log('MongoDB Connected Successfully');
    return mongoose.connection;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
