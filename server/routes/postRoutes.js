// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth'); // Middleware to verify user token

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photos'); // Set the destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Set the file name
  },
});

const upload = multer({ storage: storage });

// Create a new post
router.post('/', authMiddleware, upload.single('image'), postController.createPost);

// Update a post
router.put('/:postId', authMiddleware, upload.single('image'), postController.updatePost);

router.get('/' , authMiddleware , postController.getAllPosts)

// Delete a post
router.delete('/:postId', authMiddleware, postController.deletePost);

// Like a post
router.post('/:postId/like', authMiddleware, postController.likePost);

// Unlike a post
router.post('/:postId/unlike', authMiddleware, postController.unlikePost);

// Comment on a post
router.post('/:postId/comment', authMiddleware, postController.commentOnPost);

module.exports = router;
