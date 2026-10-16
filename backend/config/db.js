import mongoose from 'mongoose';

// Disable buffering so queries fail immediately or fallback instead of hanging for 10-15s
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  // If no MONGO_URI is specified in cloud serverless, do not attempt to reach localhost
  const connStr = process.env.MONGO_URI || (process.env.VERCEL ? null : 'mongodb://127.0.0.1:27017/doctor-booking');
  if (!connStr) {
    console.warn("MONGO_URI not configured in cloud environment. Running in resilient in-memory mode.");
    return;
  }

  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB connection notice: ${error.message}. Running in resilient mode.`);
  }
};

export default connectDB;


