import express from 'express';
import { getMessages, createMessage, deleteMessage } from '../controllers/chatMessagesController.mjs';

const router = express.Router();

// Get all messages for a chat
router.get('/:chatId', getMessages);

// Create a new message
router.post('/', createMessage);

// Delete a message
router.delete('/:id', deleteMessage);

export default router;
