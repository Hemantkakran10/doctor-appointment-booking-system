import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please enter your name'] 
  },
  email: { 
    type: String, 
    required: [true, 'Please enter your email'], 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: [true, 'Please enter a password'],
    minlength: 6,
    select: false // Exclude from query results by default
  },
  role: { 
    type: String, 
    enum: ['Patient', 'Admin'], 
    default: 'Patient' 
  },
  phone: { 
    type: String, 
    required: [true, 'Please enter your phone number'] 
  },
  image: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
