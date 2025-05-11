import express from 'express';
import { getVenues, getMyBookings } from '../controllers/venueController.mjs';
import { authenticateUser } from '../middleware/authMiddleware.mjs'; 
const router = express.Router();

router.get('/', getVenues);

router.get('/my-bookings', authenticateUser, getMyBookings);

export default router;