import User from '../models/User.mjs';
import fs from 'fs';
import path from 'path';

// Fetch user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('displayName photo');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    next(error);
  }
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { displayName } = req.body;
    const photo = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (displayName) {
      user.displayName = displayName;
    }

    // Update the user's photo
    if (photo) {
      if (user.photo) {
        const oldPhotoPath = path.join(__dirname, '../../uploads', user.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      user.photo = photo.filename;
    }

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    next(error);
  }
};