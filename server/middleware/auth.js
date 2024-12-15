const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    

    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token:" , token)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        req.user = user;
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(400).send({ message: 'Invalid token.' });
    }
};




module.exports = authMiddleware;