const mongoose = require('mongoose');
const User = require('./User');
const Message = require('./Message')
const {Schema}  = mongoose;

const ConversationSchma = new Schema({
    participants : [
        { type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
    ],
    lastMessages: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    title : {
        type : String,
    }



    
} , {timestamps: true} )

module.exports = mongoose.model('Conversation', ConversationSchma);
