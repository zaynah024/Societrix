import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ChatUser from '../models/ChatUser.mjs';
import ChatMessage from '../models/ChatMessages.mjs';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const initData = async () => {
  try {
    // Clear existing data
    await ChatUser.deleteMany({});
    await ChatMessage.deleteMany({});
    console.log('Cleared existing chat data');

    // Create chat users
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
      },
      {
        chatId: 'society-3',
        chatName: 'Physics Society',
        chatType: 'society',
        avatar: '⚛️',
        members: [
          { userId: 'admin', role: 'admin' },
          { userId: 'society-3', role: 'society' }
        ]
      }
    ];

    const chatUsers = await ChatUser.insertMany(chats);
    console.log('Chat users created:', chatUsers.length);

    // Create messages for announcements
    const announcementMessages = [
      {
        messageId: 1,
        sender: 'admin',
        content: 'Welcome to Societrix! This is the announcements channel.',
        timestamp: new Date(),
        isAdmin: true,
        chatId: 'announcements'
      },
      {
        messageId: 2,
        sender: 'Computer Science Society',
        content: 'Thank you for setting up the platform!',
        timestamp: new Date(Date.now() + 1000 * 60),
        isAdmin: false,
        chatId: 'announcements'
      }
    ];

    await ChatMessage.insertMany(announcementMessages);
    console.log('Announcement messages created');

    // Create messages for Computer Science Society
    const csMsgs = [
      {
        messageId: 1,
        sender: 'admin',
        content: 'Hello Computer Science Society, how can I help you today?',
        timestamp: new Date(),
        isAdmin: true,
        chatId: 'society-1'
      },
      {
        messageId: 2,
        sender: 'Computer Science Society',
        content: 'We need to schedule a meeting about our upcoming hackathon.',
        timestamp: new Date(Date.now() + 1000 * 60),
        isAdmin: false,
        chatId: 'society-1'
      }
    ];

    await ChatMessage.insertMany(csMsgs);
    console.log('Society messages created');

    console.log('All data initialized successfully!');
  } catch (error) {
    console.error('Error initializing data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the initialization
connectDB().then(() => {
  initData();
});

// Add instructions for running the script
console.log('Run this script with: node server/scripts/initChatData.mjs');
