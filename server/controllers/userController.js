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






 module.exports = { register , login , ProfilePic , getProfilePicture , profile  };