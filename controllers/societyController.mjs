import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Society from "../models/Society.mjs";
export const loginSociety = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const society = await Society.findOne({ email });
    if (!society || !(await bcrypt.compare(password, society.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', society });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const society = await Society.findOne({ email });
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    society.password = await bcrypt.hash(newPassword, 10);
    await society.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
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