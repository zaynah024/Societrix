import Event from '../models/Event.mjs';
import Society from '../models/Society.mjs';
import Venue from '../models/Venue.mjs';

// Fetch all events
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('societyId', 'name') 
      .populate('venueId', 'name'); 

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    next(error);
  }
};

// Fetch events by date
export const getEventsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await Event.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate('societyId', 'name') 
      .populate('venueId', 'name'); 

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events by date:', error);
    next(error);
  }
};

// Request a new event
export const requestNewEvent = async (req, res, next) => {
  try {
    const { title, description, date, societyId, venueId, sponsorships, documents } = req.body;

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Create a new event
    const newEvent = new Event({
      title,
      description,
      date,
      societyId,
      venueId,
      sponsorships,
      documents,
      status: 'pending', // Default status for new event requests
    });

    await newEvent.save();

    res.status(201).json({ message: 'Event request submitted successfully', event: newEvent });
  } catch (error) {
    console.error('Error requesting new event:', error);
    next(error);
  }
};

// Fetch societies for dropdown
export const getSocietiesForDropdown = async (req, res, next) => {
  try {
    const societies = await Society.find().select('name _id'); // Fetch only name and ID
    res.status(200).json(societies);
  } catch (error) {
    console.error('Error fetching societies for dropdown:', error);
    next(error);
  }
};

// Fetch venues for dropdown
export const getVenuesForDropdown = async (req, res, next) => {
  try {
    const venues = await Venue.find().select('name _id'); // Fetch only name and ID
    res.status(200).json(venues);
  } catch (error) {
    console.error('Error fetching venues for dropdown:', error);
    next(error);
  }
};