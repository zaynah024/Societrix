import { addSociety, getSocieties, deleteSociety, editDescription, loginSociety, resetPassword } from '../controllers/societyController.mjs';
import express from 'express'; // Import express

const router = express.Router();

router.post('/add-society', addSociety);
router.get('/societies', getSocieties);
router.delete('/societies/:id', deleteSociety);
router.patch('/societies/:id', editDescription);
router.post('/login', loginSociety); // Login route
router.post('/reset-password', resetPassword); // Password reset route

export default router;