import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Otp from '../models/Otp.js';
import { sendOtpEmail } from '../utils/emailService.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret12345', {
    expiresIn: '30d'
  });
};

// @desc    Send 6-digit registration OTP to user's email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendRegisterOtp = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields (Name, Email, Password, Phone) are required' });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Check basic email syntax
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'This email is already registered. Please sign in instead.' });
    }

    const doctorExists = await Doctor.findOne({ email: trimmedEmail });
    if (doctorExists) {
      return res.status(400).json({ message: 'This email is already registered as a doctor account.' });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save or update OTP in database with fresh timestamp (10 min expiry)
    await Otp.findOneAndUpdate(
      { email: trimmedEmail },
      { otp, createdAt: new Date(), verified: false },
      { upsert: true, new: true }
    );

    // Send email
    const mailResult = await sendOtpEmail(trimmedEmail, otp, name);

    return res.json({
      message: mailResult.delivered
        ? `A 6-digit verification code has been dispatched to ${trimmedEmail}. Please check your inbox.`
        : `Verification code generated for ${trimmedEmail}`,
      email: trimmedEmail,
      delivered: mailResult.delivered,
      previewOtp: (!mailResult.delivered || mailResult.simulated) ? otp : undefined,
      simulated: mailResult.simulated
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ message: 'Failed to send verification code. ' + error.message });
  }
};

// @desc    Register a new patient with verified OTP
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, phone, otp } = req.body;

  try {
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!otp) {
      return res.status(400).json({ message: 'Please enter the 6-digit verification code sent to your email' });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Verify OTP record
    const otpRecord = await Otp.findOne({ email: trimmedEmail, otp: otp.trim() });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP code. Please check your email or click Resend.' });
    }

    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const doctorExists = await Doctor.findOne({ email: trimmedEmail });
    if (doctorExists) {
      return res.status(400).json({ message: 'Email already registered as doctor' });
    }

    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password,
      phone: phone.trim(),
      role: 'Patient' // Self-registered accounts are always Patients
    });

    // Clean up OTP record now that user is verified & created
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      image: user.image || '',
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user/doctor & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Try User first (Patient/Admin)
    let account = await User.findOne({ email }).select('+password');
    let isDoctor = false;

    if (!account) {
      // Try Doctor
      account = await Doctor.findOne({ email }).select('+password');
      if (account) {
        isDoctor = true;
      }
    }

    if (account && (await account.comparePassword(password))) {
      return res.json({
        _id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
        image: account.image || '',
        phone: isDoctor ? undefined : account.phone,
        token: generateToken(account._id, account.role)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile & avatar photo
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, image } = req.body;
    let account;
    if (req.user.role === 'Doctor') {
      account = await Doctor.findById(req.user._id);
    } else {
      account = await User.findById(req.user._id);
    }

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (name) account.name = name;
    if (phone) account.phone = phone;
    if (image !== undefined) account.image = image;

    await account.save();

    return res.json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role,
      phone: account.phone,
      image: account.image || ''
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(req.user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Change current user's password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    let user;
    if (req.user.role === 'Doctor') {
      user = await Doctor.findById(req.user._id).select('+password');
    } else {
      user = await User.findById(req.user._id).select('+password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

