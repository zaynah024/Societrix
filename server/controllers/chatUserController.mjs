import ChatUser from '../models/ChatUser.mjs';
import ChatMessage from '../models/ChatMessages.mjs';

// Get all chats
export const getAllChats = async (req, res) => {
  try {
    const chats = await ChatUser.find();
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
};

// Get a specific chat
export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await ChatUser.findOne({ chatId: id });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat', error: error.message });
  }
};

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { chatId, chatName, chatType, members, avatar } = req.body;
    
    console.log('Creating chat with data:', { chatId, chatName, chatType });
    
    // Check if chat already exists
    const existingChat = await ChatUser.findOne({ chatId });
    if (existingChat) {
      console.log('Chat already exists:', existingChat);
      return res.status(400).json({ message: 'Chat already exists', chat: existingChat });
    }
    
    // Create the new chat
    const chat = await ChatUser.create({
      chatId,
      chatName,
      chatType,
      members: members || [{ userId: 'admin', role: 'admin' }],
      avatar: avatar || '🏛️'
    });
    
    console.log('Chat created successfully:', chat);
    
    // If this is a society chat, set up initial welcome message
    if (chatType === 'society' && !chatId.includes('announcements')) {
      // Create welcome message
      try {
        const welcomeMessage = await ChatMessage.create({
          messageId: 1,
          sender: 'admin',
          content: `Welcome ${chatName}! This is your private chat with the admin.`,
          timestamp: new Date(),
          isAdmin: true,
          chatId: chatId
        });
        console.log('Welcome message created:', welcomeMessage);
      } catch (msgError) {
        console.error('Error creating welcome message:', msgError);
      }
      
      // Add announcement about new society
      try {
        const latestAnnouncementMsg = await ChatMessage.findOne({ chatId: 'announcements' }).sort({ messageId: -1 });
        const nextMsgId = latestAnnouncementMsg ? latestAnnouncementMsg.messageId + 1 : 1;
        
        const announcementMessage = await ChatMessage.create({
          messageId: nextMsgId,
          sender: 'admin',
          content: `Welcome to our newest society: ${chatName}!`,
          timestamp: new Date(),
          isAdmin: true,
          chatId: 'announcements'
        });
        console.log('Announcement message created:', announcementMessage);
      } catch (annError) {
        console.error('Error creating announcement message:', annError);
      }
    }
    
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat', error: error.message });
  }
};

// Update chat details
export const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { chatName, members, avatar } = req.body;
    
    const chat = await ChatUser.findOneAndUpdate(
      { chatId: id },
      { chatName, members, avatar },
      { new: true }
    );
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error updating chat', error: error.message });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    await ChatUser.findOneAndDelete({ chatId: id });
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chat', error: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const { role } = req.user; // Assuming user role is available in the request
    let chats;

    if (role === 'society') {
      chats = await ChatUser.find({ $or: [{ chatId: 'announcements' }, { chatType: 'admin' }] });
    } else {
      chats = await ChatUser.find({});
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};
