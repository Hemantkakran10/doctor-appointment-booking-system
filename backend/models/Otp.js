import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Automatically delete from MongoDB after 10 minutes (600s)
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
