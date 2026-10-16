import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please enter doctor name'] 
  },
  email: { 
    type: String, 
    required: [true, 'Please enter doctor email'], 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: [true, 'Please enter a password'],
    minlength: 6,
    select: false
  },
  specialization: { 
    type: String, 
    required: [true, 'Please enter specialization'] 
  },
  degree: { 
    type: String, 
    required: [true, 'Please enter degree'] 
  },
  experience: { 
    type: Number, 
    required: [true, 'Please enter experience in years'] 
  },
  fees: { 
    type: Number, 
    required: [true, 'Please enter consultation fees'] 
  },
  hospital: {
    type: String,
    default: 'Fortis Hospital, Delhi'
  },
  rating: {
    type: Number,
    default: 4.8
  },
  reviewsCount: {
    type: Number,
    default: 210
  },
  image: {
    type: String,
    default: ''
  },
  slots_booked: {
    type: Map,
    of: [String],
    default: {}
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  role: { 
    type: String, 
    default: 'Doctor' 
  }
}, { timestamps: true });

// Pre-save middleware to hash password
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
