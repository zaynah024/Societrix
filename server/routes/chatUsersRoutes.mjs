import express from 'express';
import { 
  getAllChats, 
  getChatById, 
  createChat, 
  updateChat, 
  deleteChat 
} from '../controllers/chatUserController.mjs';

const router = express.Router();

// Get all chats
router.get('/', getAllChats);

// Get a chat by ID
router.get('/:id', getChatById);

// Create a new chat
router.post('/', createChat);

// Update a chat
router.put('/:id', updateChat);

// Delete a chat
router.delete('/:id', deleteChat);

export default router;
