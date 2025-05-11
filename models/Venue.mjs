import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
});

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true, // Maximum number of people the venue can accommodate
  },
  type: {
    type: String,
    enum: ['auditorium', 'conference', 'outdoor'], // Types of venues
    required: true,
  },
  features: {
    type: [String], // Additional features (e.g., "Stage", "Video Conferencing")
    default: [],
  },
  bookings: [BookingSchema], // Embedded bookings
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Venue = mongoose.model('Venue', VenueSchema);
export default Venue;