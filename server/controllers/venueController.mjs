import Venue from '../models/Venue.mjs';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Society from "../models/Society.mjs";
import Report from '../models/Reports.mjs';
import Event from '../models/Events.mjs';

export const getVenues = async (req, res, next) => {
  try {
    const { search, capacity, type } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (capacity) {
      if (capacity === 'small') query.capacity = { $lte: 50 };
      if (capacity === 'medium') query.capacity = { $gt: 50, $lte: 200 };
      if (capacity === 'large') query.capacity = { $gt: 200 };
    }

    if (type && type !== 'all') {
      if (type === 'auditoriums') query.type = 'auditorium';
      if (type === 'conference') query.type = 'conference';
      if (type === 'outdoor') query.type = 'outdoor';
    }

    const venues = await Venue.find(query);
    res.status(200).json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware
    const bookings = await Booking.find({ userId }).populate('venueId', 'name');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Other functions like addSociety, getSocieties, deleteSociety, etc., remain unchanged