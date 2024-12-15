const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



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

      })
      console.log(user ,
        "Token : ", token)
  } catch (error) {
      res.status(400).json({message:'Error logging in user'});
}
}

 module.exports = { register , login }