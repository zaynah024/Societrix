import Report from '../models/Reports.mjs';
import Event from '../models/Events.mjs';
import Society from '../models/Society.mjs';

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({});

    const detailedReports = await Promise.all(
      reports.map(async (report) => {
        // Fetch the event using eventId from the report
        const event = await Event.findById(report.eventId);
        if (!event) {
          return { ...report.toObject(), eventName: 'Event not found', societyName: 'Society not found', eventDate: null, time: null };
        }
        // Fetch the society using societyId from the event
        const society = await Society.findById(event.societyId);
        return {
          ...report.toObject(),
          eventName: event.eventName,
          societyName: society ? society.name : 'Society not found',
          eventDate: event.date, // Include event date
          time: event.time || 'Not specified', // Include event time
        };
      })
    ); 

    res.status(200).json(detailedReports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};

// Get reports for a specific society
export const getReportsBySocietyId = async (req, res) => {
  const { societyId } = req.params;

  try {
    // Find all events for the given society
    const events = await Event.find({ societyId });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found for this society' });
    }

    const eventIds = events.map(event => event._id);

    // Find all reports for the events of the given society
    const reports = await Report.find({ eventId: { $in: eventIds } });

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports for society:', error);
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

// Get reports for a specific society using email
export const getReportsBySocietyEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Find the society using the provided email
    const society = await Society.findOne({ email });

    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // Find all events for the given society
    const events = await Event.find({ societyId: society._id });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found for this society' });
    }

    const eventIds = events.map(event => event._id);

    // Find all reports for the events of the given society
    const reports = await Report.find({ eventId: { $in: eventIds } });

    const detailedReports = await Promise.all(
      reports.map(async (report) => {
        const event = events.find(event => event._id.toString() === report.eventId);
        return {
          ...report.toObject(),
          eventName: event ? event.eventName : 'Event not found',
          eventDate: event ? event.date : null, // Include event date
          time: event ? event.time || 'Not specified' : null, // Include event time
        };
      })
    );

    res.status(200).json(detailedReports);
  } catch (error) {
    console.error('Error fetching reports for society by email:', error);
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

// Get completed events for a specific society using email
export const getCompletedEventsBySocietyEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const society = await Society.findOne({ email });

    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    const completedEvents = await Event.find({ societyId: society._id, status: 'completed' });

    if (!completedEvents || completedEvents.length === 0) {
      return res.status(404).json({ message: 'No completed events found for this society' });
    }

    res.status(200).json(completedEvents);
  } catch (error) {
    console.error('Error fetching completed events for society by email:', error);
    res.status(500).json({ message: 'Error fetching completed events', error: error.message });
  }
};

// Update report rating
export const updateReportRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    console.log(`Updating report ${id} with rating ${rating}`);
    
    // Update the report rating
    const report = await Report.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    console.log(`Report updated: ${report._id}, EventId: ${report.eventId}`);

    // Find the associated event
    const event = await Event.findById(report.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Associated event not found' });
    }
    
    console.log(`Found event: ${event._id}, SocietyId: ${event.societyId}`);

    // Find all events for this society
    const societyEvents = await Event.find({ societyId: event.societyId });
    const eventIds = societyEvents.map(evt => evt._id);
    
    console.log(`Found ${societyEvents.length} events for society ${event.societyId}`);

    // Find all reports for these events that have ratings
    const societyReports = await Report.find({ 
      eventId: { $in: eventIds },
      rating: { $exists: true, $ne: null } // Only include reports with valid ratings
    });
    
    console.log(`Found ${societyReports.length} rated reports for society events`);

    // Calculate average rating
    let averageRating = 0;
    
    if (societyReports.length > 0) {
      const totalRating = societyReports.reduce((sum, r) => sum + r.rating, 0);
      averageRating = parseFloat((totalRating / societyReports.length).toFixed(1));
    }
    
    console.log(`Calculated average rating: ${averageRating}`);

    // Find the society before update
    const societyBeforeUpdate = await Society.findById(event.societyId);
    console.log(`Society before update: ${societyBeforeUpdate._id}, Current rating: ${societyBeforeUpdate.rating}`);
    
    // Update society rating
    const updatedSociety = await Society.findByIdAndUpdate(
      event.societyId,
      { rating: averageRating },
      { new: true }
    );

    if (!updatedSociety) {
      console.log(`Society ${event.societyId} not found`);
      return res.status(404).json({ message: 'Society not found' });
    }

    console.log(`Updated society ${updatedSociety.name || updatedSociety._id} rating from ${societyBeforeUpdate.rating} to ${updatedSociety.rating}`);
    
    // Return the updated report with society info
    res.status(200).json({
      ...report.toObject(),
      societyRating: averageRating
    });
  } catch (error) {
    console.error('Error updating report rating:', error);
    res.status(500).json({ message: 'Error updating rating', error: error.toString() });
  }
};

// Submit a new report
export const submitReport = async (req, res) => {
  const { eventId, title, content, attachments, attendeeCount } = req.body;

  try {
    // Validate event existence
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create a new report
    const newReport = new Report({
      eventId,
      submissionDate: new Date(), // Automatically set to current time
      title,
      content,
      attachments,
      attendeeCount,
      rating: 5, // Default rating set to 5
    });

    const savedReport = await newReport.save();

    // Include event details in the response
    const detailedReport = {
      ...savedReport.toObject(),
      eventName: event.eventName,
      eventDate: event.date,
      time: event.time,
    };

    res.status(201).json(detailedReport);
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Error submitting report', error: error.message });
  }
};
