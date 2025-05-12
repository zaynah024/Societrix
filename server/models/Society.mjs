import mongoose from 'mongoose';

const SocietySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    members: [{
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, default: 'member' },
        joinDate: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    rating: { 
        type: Number,
        default: 5.0, 
    }
});

const Society = mongoose.model('Society', SocietySchema);
export default Society;