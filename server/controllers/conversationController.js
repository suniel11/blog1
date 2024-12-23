const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// Create or get a conversation between two users
const createOrGetConversation = async (req, res) => {
  const { receiverId } = req.body;

  try {
    // Check if a conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    })
      .populate("participants", "name profilePicture")
      .populate("lastMessages");

    if (!conversation) {
      // Create a new conversation if one does not exist
      conversation = new Conversation({
        participants: [req.user._id, receiverId],
      });

      await conversation.save();
      conversation = await conversation.populate("participants", "name profilePicture");
    }

    res.status(200).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create or get conversation" });
  }
};

// Get all conversations for the logged-in user
const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name profilePicture")
      .populate("lastMessages")
      .sort({ updatedAt: -1 }); // Sort by most recent conversation

    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

// Delete a conversation
const deleteConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Ensure the logged-in user is part of the conversation
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ error: "You are not part of this conversation" });
    }

    // Delete the conversation and associated messages
    await Message.deleteMany({ conversationId });
    await conversation.remove();

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};

// Get messages for a specific conversation
const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    // Verify if the conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Ensure the logged-in user is a participant in the conversation
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ error: "Access denied. You are not a participant in this conversation." });
    }

    // Fetch messages for the conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // Sort by the oldest messages first
      .populate("senderId", "name profilePicture");

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
const postMessage = async (req, res) => {
  const { conversationId } = req.params;  // Conversation ID from request
  const { content } = req.body;  // Content of the message
  
  try {
    // Validate the conversation ID
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Create the new message
    const message = new Message({
      senderId: req.user._id,  // Assume `req.user._id` is the logged-in user
      
      receiverId: conversation.participants.find(id => id.toString() !== req.user._id.toString()),  // Find the other participant
      content: content,
      conversationId: conversationId,
    });

    // Save the message
    await message.save();

    // Optionally, update the last message in the conversation
    conversation.lastMessages = message._id;
    await conversation.save();

    res.status(201).json(message);  // Return the newly created message
  } catch (err) {
    console.error("Error posting message:", err);
    res.status(500).json({ error: "Failed to post message" });
  }
};


module.exports = {
  createOrGetConversation,
  getAllConversations,
  deleteConversation,
  postMessage,
  getConversationMessages, // Export the new controller
};
