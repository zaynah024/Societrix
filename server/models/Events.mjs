import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'societies',
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    sponsorship: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    rejectReason: {
        type: String,
        default: '',
        validate: {
            validator: function(v) {
                return !(this.status === 'rejected' && !v);
            },
            message: 'Reject reason is required when status is rejected'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('events', EventSchema);


