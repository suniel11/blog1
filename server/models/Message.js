const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./User');
const Conversation = require ('./Conversation');

const messageSchema = new Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,  ref: 'Conversation', required: true, },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
