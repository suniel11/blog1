import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchAndFollow = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Unauthorized access');

        const [usersResponse, currentUserResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);

        // Set the following status for each user
        const currentUserFollowing = currentUserResponse.data.following || [];
        const followingState = {};
        currentUserFollowing.forEach((id) => {
          followingState[id] = true;
        });
        setFollowing(followingState);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to perform this action.');
      return;
    }

    try {
      if (following[userId]) {
        await axios.post(
          `http://localhost:5000/api/users/unfollow/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowing((prev) => ({ ...prev, [userId]: false }));
      } else {
        await axios.post(
          `http://localhost:5000/api/users/follow/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowing((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (err) {
      console.error('Follow/Unfollow error:', err.response?.data?.message || err.message);
      setError('Failed to follow/unfollow user. Please try again.');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const handleStartConversation = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to start a conversation.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/conversations`,
        { receiverId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to the conversation page or show success
      console.log('Conversation started:', response.data);
      // Redirect to the conversation page or display a success message
      window.location.href = `/messages/${response.data._id}`; // Assuming the response returns the conversation ID
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Failed to start conversation.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full px-4 py-2 rounded-lg text-gray-800 bg-gray-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User List */}
      {filteredUsers
      .filter((user) => user._id !== localStorage.getItem("userId")) // Exclude the logged-in user
      .map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600">
              <img
                src={
                  user.profilePicture
                    ? `http://localhost:5000${user.profilePicture}`
                    : 'https://via.placeholder.com/150'
                }
                alt={`${user.name}'s Profile`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Link
                to={`/profile/${user._id}`}
                className="text-xl font-bold text-white hover:text-blue-400"
              >
                {user.name}
              </Link>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => handleFollow(user._id)}
              className={`px-4 py-2 rounded-lg text-white ${
                following[user._id]
                  ? 'bg-red-600 hover:bg-red-500'
                  : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              {following[user._id] ? 'Unfollow' : 'Follow'}
            </button>
            {following[user._id] && (
              <button
                onClick={() => handleStartConversation(user._id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                message
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchAndFollow;
