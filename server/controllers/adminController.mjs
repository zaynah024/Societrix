import Admin from '../models/Admin.mjs';
import jwt from 'jsonwebtoken';

// Handle the GET request for admin details
export const getAdmin = async (req, res, next) => {
  try {
    // Example response for admin details
    res.status(200).json({
      id: "1",
      name: "Admin",
      email: "admin@example.com",
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Admin found:', admin);

    // Compare plain-text passwords
    if (admin.password !== password) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Password matched');

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '7d', // Token valid for 7 days
    });

    console.log('JWT token generated:', token);

    // Respond with success
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    next(error); // Pass the error to the error-handling middleware
  }
};