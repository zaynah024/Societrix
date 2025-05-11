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



export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      description,
      date,
      time,
      venue,
      budget,
      sponsorship,
      status,
    } = req.body;

    // Create new event
    const newEvent = new Event({
      eventName,
      description,
      date,
      time,
      venue,
      budget,
      sponsorship,
      status,
      societyId: req.user.societyId,
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if the user belongs to the society that created the event
    if (event.societyId.toString() !== req.user.societyId.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update the event fields
    const {
      eventName,
      description,
      date,
      time,
      venue,
      budget,
      sponsorship,
      status,
    } = req.body;
    
    if (eventName) event.eventName = eventName;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (budget) event.budget = budget;
    if (sponsorship) event.sponsorship = sponsorship;
    if (status) event.status = status;
    
    await event.save();
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getEventsBySociety = async (req, res) => {
  try {
    const events = await Event.find({ societyId: req.params.societyId }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    // Check if user is admin
  
    const { status, rejectReason, budget } = req.body;
    
    if (!status) {
      return res.status(400).json({ msg: 'Status is required' });
    }
    
    // If status is rejected, rejectReason is required
    if (status === 'rejected' && !rejectReason) {
      return res.status(400).json({ msg: 'Reject reason is required when rejecting an event' });
    }
    
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    event.status = status;
    if (status === 'rejected') {
      event.rejectReason = rejectReason;
    }

    // Update budget if provided (for custom budget approvals)
    if (budget !== undefined) {
      event.budget = budget;
    }
    
    await event.save();
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const deleteEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if the user belongs to the society that created the event
    if (event.societyId.toString() !== req.user.societyId.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
};