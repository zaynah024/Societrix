import ChatMessage from '../models/ChatMessages.mjs';

// Get all messages for a specific chat
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await ChatMessage.find({ chatId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { sender, content, isAdmin, chatId } = req.body;
    
    if (!sender || !content || isAdmin === undefined || !chatId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { sender, content, isAdmin, chatId }
      });
    }
    
    // Get the latest message ID or start with 1 for this specific chat
    const latestMessage = await ChatMessage.findOne({ chatId }).sort({ messageId: -1 });
    const messageId = latestMessage ? latestMessage.messageId + 1 : 1;
    
    console.log(`Creating message: ${messageId} in chat ${chatId} from ${sender}`);
    
    const message = await ChatMessage.create({
      messageId,
      sender,
      content,
      timestamp: new Date(),
      isAdmin,
      chatId
    });
    
    console.log('Message created successfully:', message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Error creating message', error: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await ChatMessage.findByIdAndDelete(id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const { role } = req.user; // Assuming user role is available in the request
    let chats;

    if (role === 'society') {
      chats = await Chat.find({ $or: [{ chatId: 'announcements' }, { chatType: 'admin' }] });
    } else {
      chats = await Chat.find({});
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};