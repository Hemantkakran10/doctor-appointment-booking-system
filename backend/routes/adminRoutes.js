import express from 'express';
import { 
  getSystemStats, 
  addDoctor, 
  getAllAppointments,
  getRegisteredUsers
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection & restrict to Admin role for all routes in this router
router.use(protect);
router.use(restrictTo('Admin'));

router.get('/stats', getSystemStats);
router.post('/doctors', addDoctor);
router.get('/appointments', getAllAppointments);
router.get('/users', getRegisteredUsers);

export default router;

