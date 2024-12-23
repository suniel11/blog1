const express = require("express");
const { sendMessage, getMessagesByConversation, deleteMessage } = require("../controllers/messageController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/:userId", authMiddleware, sendMessage); // Send a message
router.get("/:conversationId", authMiddleware, getMessagesByConversation); // Get all messages in a conversation
router.delete("/:messageId", authMiddleware, deleteMessage); // Delete a message

module.exports = router;
