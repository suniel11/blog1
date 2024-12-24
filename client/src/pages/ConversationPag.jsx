import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ConversationPage = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);

  // Fetch current userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log(storedUserId)
    setUserId(storedUserId);
  }, []);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/conversations/${conversationId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
        
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  // Handle message deletion
  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // Update the messages state to remove the deleted message
        setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
        console.log('Message deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting message:', error.response || error.message);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/conversations/${conversationId}/messages`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-gray-800 py-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Conversation</h1>
      </div>

      {/* Messages Container */}
      <div className="w-full max-w-3xl flex-1 p-6 overflow-y-auto bg-gray-700 rounded-lg shadow-lg mt-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={`mb-4 p-4 rounded-lg shadow-md ${
                message.senderId._id === userId
                  ? 'bg-blue-600 text-right ml-auto'
                  : 'bg-gray-800 text-left'
              }`}
            >
              <p className="text-sm text-gray-300">{message.senderId.name}</p>
              <p className="text-lg">{message.content}</p>
              {/* Show delete button only if userId !== receiverId */}
              {userId !== message.receiverId && (
                <button
                  onClick={() => handleDeleteMessage(message._id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>
        )}
      </div>

      {/* Input Box */}
      <div className="w-full max-w-3xl flex items-center mt-6">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-4 rounded-l-lg text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-r-lg text-white font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ConversationPage;
