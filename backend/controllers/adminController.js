import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getSystemStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments({});
    
    // Count only users with 'Patient' role
    const totalPatients = await User.countDocuments({ role: 'Patient' });
    
    const totalAppointments = await Appointment.countDocuments({});
    
    // Revenue is calculated from completed & non-cancelled appointments
    const completedAppointments = await Appointment.find({ isCompleted: true, cancelled: false });
    const systemRevenue = completedAppointments.reduce((sum, curr) => sum + curr.amount, 0);

    return res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      systemRevenue
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add a verified doctor profile manually
// @route   POST /api/admin/doctors
// @access  Private/Admin
export const addDoctor = async (req, res) => {
  const { name, email, password, specialization, degree, experience, fees } = req.body;

  try {
    if (!name || !email || !password || !specialization || !degree || !experience || !fees) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify email is not already in use
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered as a patient/admin' });
    }

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: 'Email already registered as a doctor' });
    }

    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialization,
      degree,
      experience: Number(experience),
      fees: Number(fees),
      isActive: true,
      slots_booked: {}
    });

    return res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      degree: doctor.degree,
      experience: doctor.experience,
      fees: doctor.fees,
      isActive: doctor.isActive,
      role: doctor.role
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (live list of transactions)
// @route   GET /api/admin/appointments
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('userId', 'name email phone')
      .populate('docId', 'name specialization fees')
      .sort({ createdAt: -1 });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users (patients and doctors)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getRegisteredUsers = async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' }).select('name email phone createdAt');
    const doctors = await Doctor.find({}).select('name email specialization degree experience fees isActive createdAt');
    
    return res.json({
      patients,
      doctors
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

