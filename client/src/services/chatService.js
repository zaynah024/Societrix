import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createSocietyChat = async (society) => {
  try {
    const chatData = {
      chatId: `society-${society._id}`,
      chatName: society.name,
      chatType: 'society',
      avatar: getAvatarForSociety(society.name),
      members: [
        { userId: 'admin', role: 'admin' },
        { userId: `society-${society._id}`, role: 'society' }
      ]
    };
    
    const response = await axios.post(`${API_URL}/chat/users`, chatData);
    return response.data;
  } catch (error) {
    console.error('Error creating chat for society:', error);
    throw error;
  }
};
export const addChatMessage = async (chatId, sender, content, isAdmin = false) => {
  try {
    const messageData = {
      sender,
      content,
      isAdmin,
      chatId
    };
    
    const response = await axios.post(`${API_URL}/chat/messages`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error adding chat message:', error);
    throw error;
  }
};

export const initializeChatSystem = async () => {
  try {
    // First fetch all societies
    const societiesResponse = await axios.get(`${API_URL}/societies`);
    const societies = societiesResponse.data.societies || [];
    
    // Create chats for all societies
    const response = await axios.post(`${API_URL}/ensure-society-chats`, {
      societies: societies.map(society => ({
        _id: society._id,
        name: society.name
      }))
    });
    
    return response.data;
  } catch (error) {
    console.error('Error initializing chat system:', error);
    throw error;
  }
};


export const getAllChats = async () => {
  try {
    const response = await axios.get(`${API_URL}/chat/users`);
    return response.data;
  } catch (error) {
    console.error('Error getting chats:', error);
    throw error;
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const response = await axios.get(`${API_URL}/chat/messages/${chatId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting messages for chat ${chatId}:`, error);
    throw error;
  }
};


export const getAvatarForSociety = (societyName) => {
  const societyType = societyName.toLowerCase();
  
  if (societyType.includes('computer') || societyType.includes('tech') || societyType.includes('programming')) {
    return '💻';
  } else if (societyType.includes('drama') || societyType.includes('theatre') || societyType.includes('acting')) {
    return '🎭';
  } else if (societyType.includes('music') || societyType.includes('band') || societyType.includes('choir')) {
    return '🎵';
  } else if (societyType.includes('science') || societyType.includes('physics')) {
    return '⚛️';
  } else if (societyType.includes('art') || societyType.includes('paint')) {
    return '🎨';
  } else if (societyType.includes('sport') || societyType.includes('athletic')) {
    return '🏆';
  } else if (societyType.includes('debate') || societyType.includes('speech')) {
    return '🎙️';
  } else if (societyType.includes('book') || societyType.includes('literature') || societyType.includes('reading')) {
    return '📚';
  } else if (societyType.includes('math') || societyType.includes('mathematics')) {
    return '🔢';
  } else if (societyType.includes('game') || societyType.includes('gaming')) {
    return '🎮';
  }
  
  return '🏛️';
};
