import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';


export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret12345');

      // Find user/doctor based on decoded ID and token role
      if (mongoose.connection.readyState === 1) {
        try {
          if (decoded.role === 'Doctor') {
            req.user = await Doctor.findById(decoded.id).select('-password');
          } else {
            req.user = await User.findById(decoded.id).select('-password');
          }
        } catch (dbErr) {
          console.warn("DB user lookup notice in auth middleware:", dbErr.message);
        }
      }

      if (!req.user) {
        req.user = {
          _id: decoded.id,
          role: decoded.role,
          name: decoded.name || (decoded.role === 'Doctor' ? 'Doctor' : decoded.role === 'Admin' ? 'Admin' : 'Patient User'),
          email: decoded.email || 'user@system.com'
        };
      }

      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user ? req.user.role : 'None'}' does not have permission.`
      });
    }
    next();
  };
};
