import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import ChatUser from '../models/ChatUser.mjs';
import ChatMessage from '../models/ChatMessages.mjs';

// Load environment variables
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for setup'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initial chat data
const chats = [
  {
    chatId: 'announcements',
    chatName: 'Announcements',
    chatType: 'announcements',
    avatar: '📢',
    members: [{ userId: 'admin', role: 'admin' }]
  },
  {
    chatId: 'society-1',
    chatName: 'Computer Science Society',
    chatType: 'society',
    avatar: '💻',
    members: [
      { userId: 'admin', role: 'admin' },
      { userId: 'society-1', role: 'society' }
    ]
  },
  {
    chatId: 'society-2',
    chatName: 'Drama Club',
    chatType: 'society',
    avatar: '🎭',
    members: [
      { userId: 'admin', role: 'admin' },
      { userId: 'society-2', role: 'society' }
    ]
  }
];

// Initial messages
const messages = [
  {
    messageId: 1,
    sender: 'admin',
    content: 'Welcome to Societrix! This is the announcements channel.',
    timestamp: new Date(),
    isAdmin: true,
    chatId: 'announcements'
  },
  {
    messageId: 1,
    sender: 'admin',
    content: 'Hello Computer Science Society!',
    timestamp: new Date(),
    isAdmin: true,
    chatId: 'society-1'
  }
];

// Setup function
const setupData = async () => {
  try {
    // Clear existing data
    await ChatUser.deleteMany({});
    await ChatMessage.deleteMany({});
    console.log('Cleared existing data');

    // Insert chats
    await ChatUser.insertMany(chats);
    console.log('Inserted chats');

    // Insert messages
    await ChatMessage.insertMany(messages);
    console.log('Inserted messages');

    console.log('Setup completed successfully');
  } catch (error) {
    console.error('Error during setup:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run setup
setupData();
