const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// utility function to genrate token 
// const generateToken = (newUser) => {
//     return jwt.sign({ newUser }, process.env.SECRET_KEY, { expiresIn: '30d ,'})
// }
const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' }); // Use 'return'
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' }); // Use 'return'
      }
  
      const newUser = await User.create({ name, email, password });
  
      return res.status(201).json({ // Use 'return'
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        // token: generateToken(newUser._id),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' }); // Use 'return'
    }
  };
  

const login = async (req , res ) => {
    const { email , password} = req.body
    if(!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' })
        }

try 
{
const user = await User.findOne({ email})
if (user && (await bcrypt.compare(password, user.password))) {
    res.json(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
        })
        } else {

            res.status(401).json({ message: 'Invalid email or password' })
        }
} 
catch (error)
 {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })

}
 }

 module.exports = { register , login }