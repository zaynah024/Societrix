import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Society from "../models/Society.mjs";
import Report from '../models/Reports.mjs';
import Event from '../models/Events.mjs'; // Add this import
import ChatUser from '../models/ChatUser.mjs';
import ChatMessage from '../models/ChatMessages.mjs';

// Helper function to generate avatar for society
const getAvatarForSociety = (societyName) => {
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
  
  // Default emoji
  return '🏛️';
};

// Create a society and its corresponding chat
export const createSociety = async (req, res) => {
  try {
    console.log('Creating society with data:', req.body);
    
    // Create the society
    const society = new Society(req.body);
    const savedSociety = await society.save();
    
    console.log('Society created successfully:', savedSociety);
    
    // Create a chat for this society
    const chatId = `society-${savedSociety._id}`;
    
    try {
      const chat = await ChatUser.create({
        chatId,
        chatName: savedSociety.name,
        chatType: 'society',
        avatar: getAvatarForSociety(savedSociety.name),
        members: [
          { userId: 'admin', role: 'admin' },
          { userId: chatId, role: 'society' }
        ]
      });
      
      console.log('Chat created for society:', chat);
      
      // Add welcome message to the new chat
      const welcomeMessage = await ChatMessage.create({
        messageId: 1,
        sender: 'admin',
        content: `Welcome ${savedSociety.name}! This is your private chat with the admin.`,
        timestamp: new Date(),
        isAdmin: true,
        chatId
      });
      
      console.log('Welcome message created:', welcomeMessage);
      
      // Add announcement about the new society
      const announcements = await ChatUser.findOne({ chatId: 'announcements' });
      if (!announcements) {
        // Create announcements chat if it doesn't exist
        await ChatUser.create({
          chatId: 'announcements',
          chatName: 'Announcements',
          chatType: 'announcements',
          avatar: '📢',
          members: [{ userId: 'admin', role: 'admin' }]
        });
      }
      
      // Get the latest announcement message to determine the next ID
      const latestAnnouncementMsg = await ChatMessage.findOne({ chatId: 'announcements' }).sort({ messageId: -1 });
      const nextMsgId = latestAnnouncementMsg ? latestAnnouncementMsg.messageId + 1 : 1;
      
      // Create the announcement message
      const announcementMessage = await ChatMessage.create({
        messageId: nextMsgId,
        sender: 'admin',
        content: `Welcome to our newest society: ${savedSociety.name}!`,
        timestamp: new Date(),
        isAdmin: true,
        chatId: 'announcements'
      });
      
      console.log('Announcement message created:', announcementMessage);
      
    } catch (chatError) {
      console.error('Error creating chat for society:', chatError);
    }
    
    res.status(201).json(savedSociety);
  } catch (error) {
    console.error('Error creating society:', error);
    res.status(500).json({ message: 'Error creating society', error: error.message });
  }
};

// Add a new endpoint to ensure chats for societies
export const ensureSocietyChats = async (req, res) => {
  try {
    let societies = [];
    
    if (req.body && req.body.societies && Array.isArray(req.body.societies)) {
      societies = req.body.societies;
    } else {
      const allSocieties = await Society.find();
      societies = allSocieties.map(society => ({
        _id: society._id,
        name: society.name
      }));
    }
    
    console.log(`Ensuring chats for ${societies.length} societies`);
    
    // First ensure announcements chat
    let announcementsChat = await ChatUser.findOne({ chatId: 'announcements' });
    if (!announcementsChat) {
      announcementsChat = await ChatUser.create({
        chatId: 'announcements',
        chatName: 'Announcements',
        chatType: 'announcements',
        avatar: '📢',
        members: [{ userId: 'admin', role: 'admin' }]
      });
      
      await ChatMessage.create({
        messageId: 1,
        sender: 'admin',
        content: 'Welcome to the announcements channel!',
        timestamp: new Date(),
        isAdmin: true,
        chatId: 'announcements'
      });
      
      console.log('Created announcements chat:', announcementsChat);
    }
    
    // Create chats for each society
    const results = [];
    for (const society of societies) {
      const chatId = `society-${society._id}`;
      const existingChat = await ChatUser.findOne({ chatId });
      
      if (!existingChat) {
        try {
          // Create the chat
          const chat = await ChatUser.create({
            chatId,
            chatName: society.name,
            chatType: 'society',
            avatar: getAvatarForSociety(society.name),
            members: [
              { userId: 'admin', role: 'admin' },
              { userId: chatId, role: 'society' }
            ]
          });
          
          // Add welcome message
          await ChatMessage.create({
            messageId: 1,
            sender: 'admin',
            content: `Welcome ${society.name}! This is your private chat with the admin.`,
            timestamp: new Date(),
            isAdmin: true,
            chatId
          });
          
          results.push({
            society: society.name,
            status: 'created',
            chat
          });
        } catch (error) {
          console.error(`Error creating chat for society ${society.name}:`, error);
          results.push({
            society: society.name,
            status: 'error',
            error: error.message
          });
        }
      } else {
        results.push({
          society: society.name,
          status: 'exists',
          chat: existingChat
        });
      }
    }
    
    res.status(200).json({
      success: true,
      societiesProcessed: societies.length,
      results
    });
  } catch (error) {
    console.error('Error ensuring society chats:', error);
    res.status(500).json({ message: 'Error ensuring society chats', error: error.message });
  }
};

export const addSociety = async (req, res, next) => {
  try {
    const { name, email, password, description, members } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Validate members field
    if (members && !Array.isArray(members)) {
      return res.status(400).json({ message: "Members must be an array of ObjectId values" });
    } 

    const validMembers = members?.map((member) => {
      if (!mongoose.Types.ObjectId.isValid(member)) {
        throw new Error(`Invalid ObjectId: ${member}`);
      }
      return member;
    });

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new society
    const newSociety = new Society({ 
      name, 
      email, 
      password: hashedPassword, // Store the hashed password
      description, 
      members: validMembers 
    });
    await newSociety.save();

    res.status(201).json({ message: 'Society added successfully', society: newSociety });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export const getSocieties = async (req, res, next) => {
  try {
    const societies = await Society.find(); // Fetch all societies from the database
    res.status(200).json({ societies });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export const deleteSociety = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the society ID from the request parameters

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid society ID' });
    }

    // Find and delete the society
    const deletedSociety = await Society.findByIdAndDelete(id);
    if (!deletedSociety) {
      return res.status(404).json({ message: 'Society not found' });
    }

    res.status(200).json({ message: 'Society deleted successfully', society: deletedSociety });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
}

export const editDescription = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the society ID from the request parameters
    const { description } = req.body; // Get the new description from the request body

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid society ID' });
    }

    // Find and update the society's description
    const updatedSociety = await Society.findByIdAndUpdate(
      id,
      { description },
      { new: true } // Return the updated document
    );

    if (!updatedSociety) {
      return res.status(404).json({ message: 'Society not found' });
    }

    res.status(200).json({ message: 'Description updated successfully', society: updatedSociety });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export const updateSocietyRating = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('In updateSocietyRating function for society ID:', id);
    
    // Fetch all events for the society
    const events = await Event.find({ societyId: id });

    if (events.length === 0) {
      // If no events are found, set rating to 0
      const updatedSociety = await Society.findByIdAndUpdate(
        id,
        { rating: 0 },
        { new: true }
      );
      return res.status(200).json(updatedSociety);
    }

    // Extract all event IDs for the society
    const eventIds = events.map(event => event._id);
    console.log('Found events for society:', eventIds);

    // Fetch all reports for the events belonging to the society
    const reports = await Report.find({ eventId: { $in: eventIds } });

    if (reports.length === 0) {
      // If no reports are found, set rating to 0
      const updatedSociety = await Society.findByIdAndUpdate(
        id,
        { rating: 0 },
        { new: true }
      );
      return res.status(200).json(updatedSociety);
    }

    console.log('Found reports for society events:', reports.length);

    // Filter reports with ratings (ignore null or undefined ratings)
    const ratedReports = reports.filter(report => report.rating !== null && report.rating !== undefined);
    
    if (ratedReports.length === 0) {
      // If no rated reports are found, set rating to 0
      const updatedSociety = await Society.findByIdAndUpdate(
        id,
        { rating: 0 },
        { new: true }
      );
      return res.status(200).json(updatedSociety);
    }

    // Calculate the average rating from the reports with ratings
    const totalRating = ratedReports.reduce((sum, report) => sum + report.rating, 0);
    const averageRating = parseFloat((totalRating / ratedReports.length).toFixed(1)); // Round to 1 decimal place
    console.log('Calculated average rating:', averageRating);

    // Update the society's rating
    const updatedSociety = await Society.findByIdAndUpdate(
      id,
      { rating: averageRating },
      { new: true }
    );

    res.status(200).json(updatedSociety);
  } catch (error) {
    console.error('Error updating society rating:', error);
    res.status(500).json({ message: 'Error updating society rating', error: error.message });
  }
};

export const addMemberToSociety = async (req, res) => {
  const { id } = req.params; // Society ID
  const { name, email, role, joinDate } = req.body;

  try {
    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid society ID' });
    }

    // Find the society
    const society = await Society.findById(id);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // Check for duplicate email
    const isDuplicate = society.members.some(member => member.email === email);
    if (isDuplicate) {
      return res.status(400).json({ message: 'A member with this email already exists.' });
    }

    // Add the new member
    const newMember = { name, email, role, joinDate: joinDate || new Date() };
    society.members.push(newMember);

    await society.save();

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error adding member to society:', error);
    res.status(500).json({ message: 'Error adding member to society', error: error.message });
  }
};
