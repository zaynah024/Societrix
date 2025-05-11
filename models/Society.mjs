import mongoose from 'mongoose';

const SocietySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    members: [
        {
            name: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                required: true, 
            },
            contact: {
                type: String,
            },
        },
    ],
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    ratings: {
        type: Number, 
        default: 5.0,
    },
});

const Society = mongoose.models.Society || mongoose.model('Society', SocietySchema);
export default Society;