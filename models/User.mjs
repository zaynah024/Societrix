import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,  //filename
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);
export default User;