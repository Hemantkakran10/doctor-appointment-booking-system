import express from 'express';
import { 
  bookAppointment, 
  getMyAppointments, 
  cancelAppointment, 
  completeAppointment,
  cancelDoctorAppointment
} from '../controllers/appointmentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Patient bookings (Patient role required)
router.post('/', protect, restrictTo('Patient'), bookAppointment);
router.get('/my', protect, restrictTo('Patient'), getMyAppointments);
router.put('/:id/cancel', protect, restrictTo('Patient'), cancelAppointment);

// Doctor modifications (Doctor role required)
router.put('/:id/complete', protect, restrictTo('Doctor'), completeAppointment);
router.put('/:id/doctor-cancel', protect, restrictTo('Doctor'), cancelDoctorAppointment);

export default router;
