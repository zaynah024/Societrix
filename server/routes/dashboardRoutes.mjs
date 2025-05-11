import express from 'express';
import {
  getTotalSocieties,
  getUpcomingEvents,
  getAvailableVenues,
  getRecentEvents,
  getActiveSocieties,
} from '../controllers/dashboardController.mjs';

const router = express.Router();

router.get('/total-societies', getTotalSocieties);

router.get('/upcoming-events', getUpcomingEvents);

router.get('/available-venues', getAvailableVenues);

router.get('/recent-events', getRecentEvents);

router.get('/active-societies', getActiveSocieties);

export default router;