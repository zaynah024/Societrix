
import express from 'express';
import {
  getEvents,
  getEventsByDate,
  requestNewEvent,
  getSocietiesForDropdown,
  getVenuesForDropdown,
} from '../controllers/eventController.mjs';

const router = express.Router();


router.get('/', getEvents);


router.get('/date/:date', getEventsByDate);


router.post('/request', requestNewEvent);

router.get('/societies', getSocietiesForDropdown);

router.get('/venues', getVenuesForDropdown);

export default router;