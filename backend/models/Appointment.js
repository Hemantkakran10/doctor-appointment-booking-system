import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  docId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  slotDate: { 
    type: String, 
    required: true 
  }, // Format: YYYY-MM-DD
  slotTime: { 
    type: String, 
    required: true 
  }, // Format: HH:MM AM/PM
  amount: { 
    type: Number, 
    required: true 
  },
  cancelled: { 
    type: Boolean, 
    default: false 
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
