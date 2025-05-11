import mongoose from 'mongoose';

const AttachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
});

const ReportSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  submissionDate: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  attachments: [AttachmentSchema], 
  attendeeCount: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

const Report = mongoose.model('Report', ReportSchema);
export default Report;