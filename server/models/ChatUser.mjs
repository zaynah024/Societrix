import mongoose from 'mongoose';

const chatUserSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  chatName: {
    type: String,
    required: true
  },
  chatType: {
    type: String,
    enum: ['society', 'announcements'],
    required: true
  },
  members: [{
    userId: String,
    role: {
      type: String,
      enum: ['admin', 'society'],
      default: 'society'
    }
  }],
  avatar: {
    type: String,
    default: '💬'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ChatUser = mongoose.model('ChatUser', chatUserSchema);

export default ChatUser;
