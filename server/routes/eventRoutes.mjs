import express from 'express';
import { 
  getAllEvents, 
  getEventById,
  createEvent,
  updateEvent,
  getEventsBySociety,
  updateEventStatus,
  getCompletedEventsByEmail 
} from '../controllers/eventController.mjs';
 // Assuming you have auth middleware

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/society/:societyId', getEventsBySociety);
router.get('/completed/email/:email', getCompletedEventsByEmail);
router.put('/:id/status', updateEventStatus); 
router.post('/', createEvent); 
router.put('/:id', updateEvent);

export default router;
