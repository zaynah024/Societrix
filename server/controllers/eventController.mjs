import Event from '../models/Events.mjs';
import Society from '../models/Society.mjs';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching all events:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error('Error fetching event by ID:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    console.log('Received event data on server:', req.body);
    const {
      eventName,
      description,
      date,
      time,
      venue,
      budget,
      sponsorship,
      status,
      societyId,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!eventName) missingFields.push('eventName');
    if (!description) missingFields.push('description');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!venue) missingFields.push('venue');
    if (!societyId) missingFields.push('societyId');

    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(', ')}`);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Create new event
    const newEvent = new Event({
      eventName,
      description,
      date: new Date(date),
      time,
      venue,
      budget: Number(budget) || 0,
      sponsorship: Number(sponsorship) || 0,
      status: status || 'pending',
      societyId,
    });

    console.log('Creating event object:', newEvent);
    const event = await newEvent.save();
    console.log('Event created successfully with ID:', event._id);
    res.json(event);
  } catch (err) {
    console.error('Error creating event:', err.message);
    if (err.name === 'ValidationError') {
      const validationErrors = Object.keys(err.errors).map((field) => ({
        field,
        message: err.errors[field].message,
      }));
      return res.status(400).json({
        message: 'Validation error',
        validationErrors,
      });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user belongs to the society that created the event
    if (event.societyId.toString() !== req.user.societyId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
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
    if (date) event.date = new Date(date);
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (budget) event.budget = Number(budget);
    if (sponsorship) event.sponsorship = Number(sponsorship);
    if (status) event.status = status;

    await event.save();

    console.log('Event updated successfully:', event._id);
    res.json(event);
  } catch (err) {
    console.error('Error updating event:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const getEventsBySociety = async (req, res) => {
  try {
    const events = await Event.find({ societyId: req.params.societyId }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching events by society:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { status, rejectReason, budget } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // If status is rejected, rejectReason is required
    if (status === 'rejected' && !rejectReason) {
      return res.status(400).json({ message: 'Reject reason is required when rejecting an event' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = status;
    if (status === 'rejected') {
      event.rejectReason = rejectReason;
    }

    // Update budget if provided
    if (budget !== undefined) {
      event.budget = Number(budget);
    }

    await event.save();

    console.log('Event status updated successfully:', event._id);
    res.json(event);
  } catch (err) {
    console.error('Error updating event status:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user belongs to the society that created the event
    if (event.societyId.toString() !== req.user.societyId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Event.findByIdAndDelete(req.params.id);

    console.log('Event deleted successfully:', req.params.id);
    res.json({ message: 'Event removed' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const getCompletedEventsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Find the society using the provided email
    const society = await Society.findOne({ email });

    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // Find all completed events for the given society
    const completedEvents = await Event.find({ societyId: society._id, status: 'completed' });

    if (!completedEvents || completedEvents.length === 0) {
      return res.status(404).json({ message: 'No completed events found for this society' });
    }

    res.status(200).json(completedEvents);
  } catch (error) {
    console.error('Error fetching completed events by email:', error);
    res.status(500).json({ message: 'Error fetching completed events', error: error.message });
  }
};
