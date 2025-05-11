import express from 'express';
import { 
  getAllEvents, 
  getEventById,
  createEvent,
  updateEvent,
  getEventsBySociety,
  updateEventStatus 
} from '../controllers/eventController.mjs';
 // Assuming you have auth middleware

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/society/:societyId', getEventsBySociety);

// Protected routes
/* router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent); */
router.put('/:id/status', updateEventStatus); 

export default router;
