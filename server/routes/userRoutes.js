const { register , login , ProfilePic } = require('../controllers/userController');
const multer = require("multer");
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Directory where images are stored
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
  });
  
  const upload = multer({ storage });

router.post('/register' , register)
router.post('/login' , login)
router.post('/upload',  authMiddleware,
    upload.single("profilePicture"),
    ProfilePic
  );

// Set up Multer for file uploads


module.exports = router;
