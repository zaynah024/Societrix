import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Society from "../models/Society.mjs";
import Report from '../models/Reports.mjs';
import Event from '../models/Events.mjs'; // Add this import

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
