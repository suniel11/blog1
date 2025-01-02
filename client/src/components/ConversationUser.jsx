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
        // const data =  response.data
        // console.log(data)
        
      } catch (err) {
        setError('Failed to fetch conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();


    // console.log(conversations.participants)
    const data =  conversations.participants

    if (conversations.participants !== loggedInUserId) {
      console.log(data)
    }

  }, []);
  const loggedInUserId = localStorage.getItem("userId");

  


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    
    <div className="text-black bg-pink-200 h-full">
      <h1 className="text-center text-2xl font-bold mb-4">Your Conversations</h1>
      <div className="space-y-4 h-full">
        {conversations.map((conversation) => (
          <button
            key={conversation._id}
            onClick={() => navigate(`/messages/${conversation._id}`)}
            className="block w-full text-left px-4 py-2 bg-teal-200 hover:bg-gray-800 rounded-lg"
          >


{conversation.participants
            .filter((p) => p._id !== loggedInUserId)

            .map((user) => (
              <img
                key={user._id}
                src={
                  user.profilePicture
                    ? `http://localhost:5000${user.profilePicture}` 
                    : "https://via.placeholder.com/150" 
                }
                alt={`${user.name}'s profile`}
               
                className="w-10 h-10 rounded-full mr-2"
              />
           
            )) }


            
{conversation.title || conversation.participants.filter((p) => p._id !== loggedInUserId).map((user) => user.name)}

</button>
 ))}
      </div>
    </div>
  );
};

export default ConversationsUser;
