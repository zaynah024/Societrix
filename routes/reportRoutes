import express from 'express';
import { getAllReports, updateReportRating } from '../controllers/reportController.mjs';

const router = express.Router();

// Get all reports
router.get('/', getAllReports);

// Update report rating
router.put('/:id/rating', updateReportRating);

export default router;