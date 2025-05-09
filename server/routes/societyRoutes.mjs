import express from 'express';
import { addSociety } from '../controllers/societyController.mjs';

const router = express.Router();

router.post('/add-society', addSociety);

export default router;