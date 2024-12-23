import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Conversation = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response:', response.data); // Debugging
        if (response.data && Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load messages');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/messages/${userId}`,
        { content: newMessage , conversationId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: { _id: loggedInUserId },
          receiverId: { _id: userId },
          content: newMessage,
        },
      ]);
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-white mb-6">Conversation</h2>
      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-4 mb-6">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const senderId = message.senderId?._id;
            const receiverId = message.receiverId?._id;
            const content = message.content || 'No content available';

            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  senderId === loggedInUserId ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <p className="text-white">{content}</p>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400">No messages yet.</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center space-x-4">
        <textarea
          className="p-2 rounded-lg text-black w-full"
          rows="3"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;
