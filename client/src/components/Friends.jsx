import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const currentUserId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/users/${currentUserId}/following`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
        setFriends(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Followers</h2>
      {friends.length === 0 ? (
        <p className="text-gray-400">You have no followers.</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend._id} className="flex items-center mb-4">
              <img
                src={`http://localhost:5000${friend.profilePicture}` }
                alt={`${friend.name}'s profile`}
                className="w-10 h-10 rounded-full mr-2"
              />

<Link
                    to={`/profile/${friend._id}`}
                    className="text-xl font-bold text-white hover:text-blue-400"
                  >
                    {friend.name}
                  </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;