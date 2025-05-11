import express from 'express';
import {
  getSocietyDetails,
  updateSocietyDetails,
  getSocietyEvents,
} from '../controllers/societyController.mjs';

const router = express.Router();

router.get('/:societyId', getSocietyDetails);

router.put('/:societyId', updateSocietyDetails);
router.get('/:societyId/events', getSocietyEvents);

export default router;