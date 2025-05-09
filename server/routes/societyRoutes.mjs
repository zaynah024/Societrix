import express from 'express';
import { addSociety, getSocieties, deleteSociety, editDescription } from '../controllers/societyController.mjs';

const router = express.Router();

router.post('/add-society', addSociety);
router.get('/societies', getSocieties); 
router.delete('/societies/:id', deleteSociety);
router.patch('/societies/:id', editDescription);

export default router;