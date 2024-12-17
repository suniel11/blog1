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
  });


    

// Bcrypt
// userSchema.pre('save', async (next) =>  {
//     const user = this;
//     console.log(user)
//    if(!user.isModified('password'))
//     return next();
// console.log('just before saving')
// user.password = await bcrypt.hash(user.password, 10);
// console.log('after hashing')
// next();
//  });


module.exports = mongoose.model('User', userSchema);
