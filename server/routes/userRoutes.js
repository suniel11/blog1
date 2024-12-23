const { register , login , ProfilePic, getProfilePicture , profile, search  ,follow , unfollow, getUsers, getProfiles, following, me} = require('../controllers/userController');
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
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      if (ext !== '.jpg' || ext !== '.png') {
          return cb(res.status(400).end('only jpg, png are allowed'), false);
      }
      cb(null, true)
  }
  }); 
  const upload = multer({ storage : storage });

router.post('/register' , register)
router.post('/login' , login)
router.post('/upload',  authMiddleware,  upload.single("profilePicture"),
    ProfilePic
  );
  router.get('/profilePicture', authMiddleware, getProfilePicture)
  router.get('/profile',authMiddleware, profile)
  router.get('/search' , authMiddleware , search)
  router.post('/follow/:userId' , authMiddleware , follow)
  router.post('/unfollow/:userId', authMiddleware, unfollow);
  router.get('/following', authMiddleware, following);
 router.get('/' , authMiddleware , getUsers)
 router.get('/me' , authMiddleware , me)
 router.get('/:id' , authMiddleware  , getProfiles)
module.exports = router;
