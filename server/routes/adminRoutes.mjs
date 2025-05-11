import express from 'express';
import { getAdmin } from '../controllers/adminController.mjs';

const router = express.Router();

// Route to get admin details
router.get('/', getAdmin);

export default router;