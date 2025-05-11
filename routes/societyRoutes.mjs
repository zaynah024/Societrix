import express from 'express';
import { addSociety, getSocieties, deleteSociety, editDescription, updateSocietyRating } from '../controllers/societyController.mjs';

const router = express.Router();

router.post('/add-society', addSociety);
router.get('/societies', getSocieties); 
router.delete('/societies/:id', deleteSociety);
router.patch('/societies/:id', editDescription);
router.put('/societies/:id/rating', updateSocietyRating);

export default router;

