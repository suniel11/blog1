const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const cors = require('cors');


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

//  mongoose connection 

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB')
        }).catch(err => {
            console.log(err.message)
            });

// API Routes
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
