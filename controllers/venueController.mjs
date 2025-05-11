import Venue from '../models/Venue.mjs';

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