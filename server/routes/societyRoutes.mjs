import express from 'express';
import { addSociety, getSocieties, deleteSociety } from '../controllers/societyController.mjs';

const router = express.Router();

router.post('/add-society', addSociety);
router.get('/societies', getSocieties); 
router.delete('/societies/:id', deleteSociety); 


export default router;