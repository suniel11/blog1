const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Send a message
const sendMessage = async (req, res) => {
    const { conversationId, content } = req.body;
  
    try {
      // Validate request data
      if (!conversationId || !content) {
        return res.status(400).json({ error: "Conversation ID and content are required" });
      }
  
      // Find the conversation to get the receiverId
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
  
      // Determine the receiver based on the sender and conversation participants
      const receiverId =
        conversation.participants.find((participant) => participant.toString() !== req.user._id.toString());
  
      if (!receiverId) {
        return res.status(400).json({ error: "Unable to determine the receiver of the message" });
      }
  
      // Create a new message
      const message = new Message({
        conversationId,
        senderId: req.user._id,
        receiverId,
        content,
      });
  
      const savedMessage = await message.save();
  
      // Update the last message in the conversation
      conversation.lastMessages = savedMessage._id;
      conversation.updatedAt = Date.now();
      await conversation.save();
  
      res.status(201).json({ message: "Message sent successfully", data: savedMessage });
    } catch (err) {
      console.error("Error sending message:", err);
      res.status(500).json({ error: "Failed to send message" });
    }
  };
  

// Get all messages for a conversation
const getMessagesByConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    // Validate conversation ID
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Retrieve messages for the conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // Oldest to newest
      .populate("senderId", "name profilePicture")
      .populate("receiverId", "name profilePicture");


      const response = messages.map((message) => ({
        senderName: message.senderId.name, // Access sender's name
        receiverName: message.receiverId.name, // Access receiver's name
        content: message.content,         // Include the message content
      }));

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
  
    try {
      // Find the message by ID
      const message = await Message.findById(messageId);
  
      // Check if the message exists
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      // Ensure the user can only delete their own messages
      if (message.senderId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "You can only delete your own messages" });
      }
  
      // Delete the message
      await Message.deleteOne({ _id: messageId });
 // `delete()` removes the document from the database
  
      // Send success response
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
      console.error("Error deleting message:", err);
      res.status(500).json({ error: "Failed to delete message" });
    }
  };
  

module.exports = {
  sendMessage,
  getMessagesByConversation,
  deleteMessage,
};
