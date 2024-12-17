
const Message = require('../models/Message')

const messages = async (req , res) => {
    const { receiverId, content } = req.body;
  try {
    const message = new Message({
      senderId: req.user.id,
      receiverId,
      content,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
}

const conversations = async (req , res) => {
    try {
        const conversations = await Message.find({
          $or: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        })
          .populate('senderId', 'name profilePicture')
          .populate('receiverId', 'name profilePicture');
        res.status(200).json(conversations);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch conversations' });
      }

}


const getMessages = async (req , res) => {

    const { userId} = req.params;
    try {
        const messages = await Message.find({
            $or: [{ senderId: userId }, { recieverId: userId }],

            }).sort('timestamp');
            res.status(200).json({ messages })

}
catch (error) {
    res.status(500).json({ message: "Error fetching messages" })
}
}

module.exports = { messages , conversations , getMessages }