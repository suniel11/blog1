const express = require("express");
const { createOrGetConversation, getAllConversations,   deleteConversation , getConversationMessages, postMessage} = require("../controllers/conversationController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, createOrGetConversation); // Create or get a conversation
router.get("/", authMiddleware, getAllConversations); // Get all conversations
router.delete("/:conversationId", authMiddleware, deleteConversation); // Delete a conversation
router.get('/:conversationId/messages' , authMiddleware , getConversationMessages)
router.post('/:conversationId/messages' , authMiddleware , postMessage)
module.exports = router;
