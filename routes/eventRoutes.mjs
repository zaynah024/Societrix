

import express from 'express';
import { 
  getAllEvents, 
  getEventById,
   requestNewEvent,
  getEventsBySociety,
  updateEventStatus ,
  getSocietiesForDropdown,
  
  
  getVenuesForDropdown,
} from '../controllers/eventController.mjs';
 // Assuming you have auth middleware

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/society/:societyId', getEventsBySociety);
router.post('/request', requestNewEvent);
// Protected routes
/* router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent); */
router.put('/:id/status', updateEventStatus); 
router.get('/societies', getSocietiesForDropdown);

router.get('/venues', getVenuesForDropdown);
export default router;