import express from 'express';
import { 
  getDoctors, 
  getDoctorById, 
  updateDoctorProfile, 
  getDoctorAppointments, 
  getDoctorAnalytics,
  getSuggestions
} from '../controllers/doctorController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getDoctors);
router.get('/suggestions', getSuggestions);
router.get('/:id', getDoctorById);


// Protected routes (Doctor only)
router.put('/profile', protect, restrictTo('Doctor'), updateDoctorProfile);
router.get('/appointments', protect, restrictTo('Doctor'), getDoctorAppointments);
router.get('/analytics', protect, restrictTo('Doctor'), getDoctorAnalytics);

export default router;
