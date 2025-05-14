
const mongoose = require('mongoose');


require('dotenv').config();


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tech_polls_testing';


const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');
  console.log(`Connection URI: ${MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
  
  try {

    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:');
    console.error(error.message);
    

    process.exit(1);
  }
};


module.exports = connectDB;
