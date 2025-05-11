import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
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
    required: true, 
  },
  type: {
    type: String,
    enum: ['auditorium', 'conference', 'outdoor'],
    required: true,
  },
  features: {
    type: [String], 
    default: [],
  },
  bookings: [BookingSchema], 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Venue = mongoose.model('Venue', VenueSchema);
export default Venue;