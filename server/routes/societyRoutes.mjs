import express from 'express';
import { addSociety, getSocieties, deleteSociety, editDescription, updateSocietyRating, ensureSocietyChats } from '../controllers/societyController.mjs';

const router = express.Router();

router.post('/add-society', addSociety);
router.get('/societies', getSocieties); 
router.delete('/societies/:id', deleteSociety);
router.patch('/societies/:id', editDescription);
router.put('/societies/:id/rating', updateSocietyRating);

// Route to ensure all societies have chats
router.get('/ensure-society-chats', ensureSocietyChats);
router.post('/ensure-society-chats', ensureSocietyChats);

export default router;


