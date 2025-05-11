import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.mjs';
import multer from 'multer';

const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // file uploads 

router.get('/:userId', getUserProfile);

router.patch('/:userId', upload.single('photo'), updateUserProfile);

export default router;