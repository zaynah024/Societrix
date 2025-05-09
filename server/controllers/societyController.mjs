import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Society from "../models/society.mjs";

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