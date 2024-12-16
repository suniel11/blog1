const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    // console.log("Authorization Header:", authHeader);
  
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    // console.log("Extracted Token:", token);
  
    if (!token || token === 'null') {
      return res.status(401).send({ message: 'Access denied. No valid token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   console.log("Decoded JWT Payload:", decoded);
  
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }
  
      req.user = user;
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).send({ message: 'Invalid token.' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ message: 'Token expired.' });
      } else {
        return res.status(500).send({ message: 'Something went wrong.' });
      }
    }
  };
  
  module.exports = authMiddleware;
  
