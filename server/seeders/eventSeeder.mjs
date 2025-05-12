import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Events.mjs';
import Society from '../models/Society.mjs'; // Fix the import path

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/societrix')
  .then(() => console.log('MongoDB connected for seeding events'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedEvents = async () => {
  try {
    // Get existing societies
    const societies = await Society.find({});
    
    if (societies.length === 0) {
      console.log('No societies found in the database. Please seed societies first.');
      process.exit(1);
    }
    
    // Use real society IDs
    const societyIds = societies.map(society => society._id);
    
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');
    
    // Sample events data using real society IDs
    const sampleEvents = [
      {
        eventName: 'Annual Tech Summit',
        description: 'A full-day tech conference featuring industry speakers, workshops, and networking opportunities.',
        date: new Date('2023-11-15'),
        time: '10:00 AM - 5:00 PM',
        venue: 'Main Auditorium',
        societyId: societyIds[0],
        budget: 5000,
        sponsorship: 2000,
        status: 'completed'
      },
      {
        eventName: 'Summer Theater Production',
        description: 'A theatrical performance of "A Midsummer Night\'s Dream" with student actors and production crew.',
        date: new Date('2023-11-22'),
        time: '7:00 PM - 9:30 PM',
        venue: 'University Theater',
        societyId: societyIds[1],
        budget: 8000,
        sponsorship: 3000,
        status: 'pending'
      },
      {
        eventName: 'Entrepreneurship Workshop',
        description: 'Workshop with successful entrepreneurs sharing their experiences and offering mentorship.',
        date: new Date('2023-11-05'),
        time: '2:00 PM - 6:00 PM',
        venue: 'Conference Hall B',
        societyId: societyIds[2],
        budget: 3000,
        sponsorship: 1500,
        status: 'pending'
      },
      {
        eventName: 'Cultural Diversity Fair',
        description: 'Annual exhibition showcasing cultures from around the world with food, performances, and displays.',
        date: new Date('2023-12-10'),
        time: '11:00 AM - 8:00 PM',
        venue: 'University Quad',
        societyId: societyIds[3],
        budget: 6500,
        sponsorship: 2500,
        status: 'pending'
      },
      {
        eventName: 'Research Symposium',
        description: 'Platform for graduate students to present their research findings and receive feedback from faculty.',
        date: new Date('2023-12-18'),
        time: '9:00 AM - 4:00 PM',
        venue: 'Science Building Atrium',
        societyId: societyIds[0],
        budget: 2500,
        sponsorship: 1000,
        status: 'approved'
      },
      {
        eventName: 'Alumni Networking Night',
        description: 'Evening event connecting current students with successful alumni for career advice and opportunities.',
        date: new Date('2024-01-20'),
        time: '6:30 PM - 9:00 PM',
        venue: 'University Club',
        societyId: societyIds[1],
        budget: 4000,
        sponsorship: 3000,
        status: 'approved'
      },
      {
        eventName: 'Hackathon 2023',
        description: '24-hour coding competition where teams build innovative solutions to real-world problems.',
        date: new Date('2023-11-25'),
        time: '10:00 AM - 10:00 AM (next day)',
        venue: 'Computer Science Building',
        societyId: societyIds[0],
        budget: 7500,
        sponsorship: 5000,
        status: 'rejected',
        rejectReason: 'Date conflicts with university-wide event. Please reschedule.'
      },
      {
        eventName: 'Fitness Challenge Week',
        description: 'Week-long series of fitness activities, competitions, and wellness workshops open to all students.',
        date: new Date('2024-02-05'),
        time: 'Various times throughout the week',
        venue: 'University Gym',
        societyId: societyIds[2],
        budget: 3200,
        sponsorship: 1200,
        status: 'completed'
      },
      {
        eventName: 'Mental Health Awareness Day',
        description: 'A day dedicated to promoting mental health awareness with workshops, support resources, and relaxation activities.',
        date: new Date('2023-12-05'),
        time: '9:00 AM - 4:00 PM',
        venue: 'Student Center',
        societyId: societyIds[3],
        budget: 2800,
        sponsorship: 1500,
        status: 'pending'
      },
      {
        eventName: 'Career Fair 2023',
        description: 'Annual career fair connecting students with potential employers from various industries.',
        date: new Date('2023-11-30'),
        time: '10:00 AM - 3:00 PM',
        venue: 'University Gymnasium',
        societyId: societyIds[2],
        budget: 5500,
        sponsorship: 4000,
        status: 'approved'
      }
    ];
    
    // Insert events into the database
    await Event.insertMany(sampleEvents);
    
    console.log('Sample events data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events data:', error);
    process.exit(1);
  }
};

// Run the seeder
seedEvents();
