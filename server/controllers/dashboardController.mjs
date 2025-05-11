import Society from '../models/Society.mjs';
import Event from '../models/Events.mjs';
import Venue from '../models/Venue.mjs';

// Get total societies
export const getTotalSocieties = async (req, res, next) => {
  try {
    const totalSocieties = await Society.countDocuments();
    res.status(200).json({ totalSocieties });
  } catch (error) {
    console.error('Error fetching total societies:', error);
    next(error);
  }
};

// Get upcoming events
export const getUpcomingEvents = async (req, res, next) => {
  try {
    const upcomingEvents = await Event.find({ date: { $gt: new Date() } });
    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    next(error);
  }
};

// Get available venues
export const getAvailableVenues = async (req, res, next) => {
  try {
    const availableVenues = await Venue.find({ 'bookings.0': { $exists: false } });
    res.status(200).json(availableVenues);
  } catch (error) {
    console.error('Error fetching available venues:', error);
    next(error);
  }
};

// Get recent events
export const getRecentEvents = async (req, res, next) => {
  try {
    const recentEvents = await Event.find()
      .sort({ date: -1 }) 
      .limit(5) 
      .populate('societyId', 'name') 
      .populate('venueId', 'name'); 

    const formattedEvents = recentEvents.map((event) => ({
      eventName: event.name,
      societyName: event.societyId.name,
      date: event.date,
      venueName: event.venueId.name,
      status: event.status,
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching recent events:', error);
    next(error);
  }
};

// Get active societies
export const getActiveSocieties = async (req, res, next) => {
  try {
    const societies = await Society.find().populate('events', 'name'); 
    const activeSocieties = societies
      .map((society) => ({
        name: society.name,
        memberCount: society.memberCount,
        eventCount: society.events.length,
      }))
      .sort((a, b) => b.eventCount - a.eventCount) 
      .slice(0, 4); 

    res.status(200).json(activeSocieties);
  } catch (error) {
    console.error('Error fetching active societies:', error);
    next(error);
  }
};