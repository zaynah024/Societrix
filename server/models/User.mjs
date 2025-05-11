import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,  
  },
 
});

const User = mongoose.model('User', UserSchema);
export default User;