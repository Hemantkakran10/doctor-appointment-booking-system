import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-booking';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB connection notice: ${error.message}. Running in resilient mode.`);
  }
};

export default connectDB;

