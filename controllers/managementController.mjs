import Society from '../models/Society.mjs';
import Event from '../models/Event.mjs';

export const getSocietyDetails = async (req, res, next) => {
  try {
    const { societyId } = req.params;

    const society = await Society.findById(societyId).populate('events', 'name date status');
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    res.status(200).json({
      name: society.name,
      description: society.description,
      members: society.members,
      events: society.events,
    });
  } catch (error) {
    console.error('Error fetching society details:', error);
    next(error);
  }
};

export const updateSocietyDetails = async (req, res, next) => {
  try {
    const { societyId } = req.params;
    const { description, members } = req.body;

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    if (description) society.description = description;
    if (members) society.members = members;

    await society.save();

    res.status(200).json({ message: 'Society details updated successfully', society });
  } catch (error) {
    console.error('Error updating society details:', error);
    next(error);
  }
};

export const getSocietyEvents = async (req, res, next) => {
  try {
    const { societyId } = req.params;

    const events = await Event.find({ societyId }).select('name date status venueId').populate('venueId', 'name');
    if (!events) {
      return res.status(404).json({ message: 'No events found for this society' });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching society events:', error);
    next(error);
  }
};