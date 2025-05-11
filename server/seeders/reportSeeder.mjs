import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from '../models/Reports.mjs';
import Event from '../models/Events.mjs';

dotenv.config();

const seedReports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/societrix');
    console.log('MongoDB connected for seeding reports');

    const events = await Event.find({});
    if (events.length === 0) {
      console.log('No events found. Please seed events first.');
      process.exit(1);
    }

    const eventIds = events.map(event => event._id);

    await Report.deleteMany({});
    console.log('Cleared existing reports');

    const sampleReports = [
      {
        eventId: eventIds[0],
        submissionDate: new Date('2023-11-18'),
        title: 'Annual Tech Summit Report',
        content: 'The Tech Summit was a great success with over 200 attendees.',
        attachments: [
          { name: 'tech_summit_photos.zip', size: '15.2 MB' },
          { name: 'attendee_feedback.pdf', size: '420 KB' }
        ],
        attendeeCount: 210,
        rating: 4
      },
      {
        eventId: eventIds[1],
        submissionDate: new Date('2023-11-25'),
        title: 'Summer Theater Production Report',
        content: 'The Summer Theater Production was a delightful event with a full house.',
        attachments: [
          { name: 'theater_photos.zip', size: '12.5 MB' },
          { name: 'audience_feedback.pdf', size: '350 KB' }
        ],
        attendeeCount: 150,
        rating: 5
      }
    ];

    await Report.insertMany(sampleReports);
    console.log('Sample reports data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reports data:', error);
    process.exit(1);
  }
};

seedReports();
