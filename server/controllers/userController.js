const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')



const register = async (req, res) => {
  const { name , email , password } = req.body

  try {
      const hashedPassword = await bcrypt.hash(password , 10 );
      const newUser = new User ({ name , email , password : hashedPassword })

      await newUser.save();
      res.status(201).json({message:'User registered successfully'});
      } catch (error) {
          res.status(400).json({message:'Error registering user'});
  }
}
  

const login = async (req , res  ) => {
  const { email , password } = req.body

  try {
const user = await User.findOne({email})
if(!user) return res.status(404).json({message:'User not found'})

  const isPasswordValid = await bcrypt.compare(password , user.password );
  if (!isPasswordValid)
       return res.status(400).json({message:'Invalid password'})

      const token = jwt.sign({id: user._id} , process.env.JWT_SECRET , {expiresIn:'1h'})

      res.status(200).json({token ,
        name : user.name ,
        email : user.email ,
        friends : user.friends ,
        userId : user._id ,
        message : 'Logged in successfully' ,
        ProfilePic : user.profilePicture

      })
      console.log(user ,
        "Token : ", token)
  } catch (error) {
      res.status(400).json({message:'Error logging in user'});
}
}


const ProfilePic = async ( req ,res ) => {
 try { 
const user = await User.findById(req.user.id)
if (!user) {
  return res.status(404).json({message: 'User not found'})
} else { 

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  user.profilePicture = `/uploads/${req.file.filename}`
  
  await user.save()

  return res.status(200).json({ message: "Profile picture updated successfully" , profilePicture: user.profilePicture , 
    time : user.createdOn
   });
 
}
 }
 catch (error) {
  console.log(error)
  res.status(400).json({message:'Error updating profile picture'});
 }


}


const getProfilePicture = async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id); // Log user ID from token

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    return res.status(200).json({
      message: 'Profile picture fetched successfully',
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Error fetching profile picture' });
  }
};

const profile = async (req, res) => {
try { 
const user = await User.findById(req.user.id);
if(!user) {
  return res.status(404).json({ message: 'User not found' });
 }
 {
 return res.status(200).json({ 
  name : user.name , 
  email : user.email ,
  profilePicture : user.profilePicture ,
  createdOn : user.createdOn 
 })
 }

} catch (error) {
  console.log(error)
  res.status(400).json({ message: 'Error fetching profile' });
}}


const search = async (req, res) => {
  try {
    const {query} = req.query;

    if(!query){
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    const users = await User.find({$or: [
      {name: {$regex: query, $options: 'i'}},
      {email: {$regex: query, $options: 'i'}},
      ]}).select('name email profilePicture friends ')
      res.status(200).json(users)

  }catch(error){
    console.log(error)
    res.status(400).json({ message: 'Error searching' });
  }}

// Follow a user
const follow = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = req.user; // From the authMiddleware
    // console.log('UserId:', req.params.userId);

    // Check if the user being followed exists
    const followedUser = await User.findById(userId);
    if (!followedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    // console.log('Follow request received:', req.params.userId, req.user);

    // Check if already following
    if (currentUser.following.includes(userId)) {
      return res.status(400).send({ message: 'You are already following this user.' });
    }

    // Add to friends (following)
    currentUser.following.push(userId);
    await currentUser.save();

    // Add current user to followed user's friend list
    followedUser.followers.push(currentUser._id);
    await followedUser.save();

    res.status(200).send({ message: 'User followed', following: currentUser.following ,
      user : currentUser ,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

const unfollow = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = req.user; // From the authMiddleware

    // Check if the user being unfollowed exists
    const followedUser = await User.findById(userId);
    if (!followedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Check if already not following
    if (!currentUser.following.includes(userId)) {
      return res.status(400).send({ message: 'You are not following this user.' });
    }

    // Remove from friends (unfollow)
    currentUser.following = currentUser.following.filter(friend => friend.toString() !== userId);
    await currentUser.save();

    followedUser.followers = followedUser.followers.filter(friend => friend.toString() !== currentUser._id.toString());
    await followedUser.save();

    res.status(200).send({ message: 'User unfollowed', following: currentUser.following });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};


  const getUsers = async (req, res) => {
    try {
      const users = await User.find();  // Assuming User is your Mongoose model
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  const getProfiles = async (req , res)  => {
    try {
      const userId = req.params.id
      const user = await User.findById(userId)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
  
      const currentUserId = req.user._id

      user.userId = currentUserId
      res.status(200).json(user)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }}
   const following = async (req, res) => {
      try {
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId);
    
        if (!currentUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Fetch all users that the current user is following
        const followingUsers = await User.find({ '_id': { $in: currentUser.following } });
    
        return res.status(200).json(followingUsers);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    };
    
    const me = async (req, res) => {
      try {
        const user = await User.findById(req.userId); // Use req.userId here
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
    

    

 module.exports = { register , login , ProfilePic , getProfilePicture , profile , search , follow , unfollow , getUsers , getProfiles , following , me};