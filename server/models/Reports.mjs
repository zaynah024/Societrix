import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true }
});

const reportSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  submissionDate: { type: Date, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [attachmentSchema],
  attendeeCount: { type: Number, required: true },
  rating: { 
    type: Number,
    min: 1,
    max: 5,
    default: null // Make rating optional initially
  }
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
