import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    name: {
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
    location: {
        type: String,
        required: true,
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'societies',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});