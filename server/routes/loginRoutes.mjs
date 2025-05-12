import express from 'express';
import { login } from '../controllers/loginController.mjs';

const router = express.Router();

router.post('/', login);

export default router;