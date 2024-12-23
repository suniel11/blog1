const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name : {
    type: String,
    required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
        
  },
  password : {
    type: String,
    required: true
    },

    profilePicture: { type: String, default: "" },
  createdOn: {
    type: Date,
    default: Date.now
    },
    friends: [
      {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    // messages: [
    //   {type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
    //   ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  } ,{ versionKey: false } );


    




module.exports = mongoose.model('User', userSchema);
