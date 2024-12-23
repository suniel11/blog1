import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConversationsUser = () => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:5000/api/conversations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setConversations(response.data);
      } catch (err) {
        setError('Failed to fetch conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="text-green bg-black h-full">
      <h1 className="text-center text-2xl font-bold mb-4">Your Conversations</h1>
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <button
            key={conversation._id}
            onClick={() => navigate(`/conversation/${conversation._id}`)}
            className="block w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg"
          >
{conversation.title || `Conversation with ${conversation.participants.map((participant) => participant.name).join(', ')}`}
</button>
        ))}
      </div>
    </div>
  );
};

export default ConversationsUser;
