import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Attach user info to the request
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};