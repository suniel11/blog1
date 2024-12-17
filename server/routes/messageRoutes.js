const { messages , conversations , getMessages} = require('../controllers/messageController')
const authMiddleware = require('../middleware/auth')
const express = require('express');
const router = express.Router()


router.post('/' , authMiddleware , messages)
router.get('/conversations' , authMiddleware , conversations)
router.get('/:userId' , authMiddleware , getMessages)

module.exports = router;
