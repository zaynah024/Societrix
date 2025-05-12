import mongoose from 'mongoose';

const chatMessagesSchema = new mongoose.Schema({
  messageId: {
    type: Number,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  chatId: {
    type: String,
    required: true,
    ref: 'ChatUser'
  }
});

// Compound index to ensure messageId is unique within each chat
chatMessagesSchema.index({ chatId: 1, messageId: 1 }, { unique: true });

const ChatMessage = mongoose.model('ChatMessage', chatMessagesSchema);

export default ChatMessage;
