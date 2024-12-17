import React, { useState } from 'react';
import axios from 'axios';

const SearchAndFollow = ({ profileData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set()); // Track followed users

  const token = localStorage.getItem('token');

  // Search for users based on query
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/users/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data);
    } catch (err) {
      setError('Error searching users');
      console.error(err);
    }
  };

  // Follow the selected user
  const handleFollow = async (userId) => {

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
      }
      
      console.log('Following user with ID:', userId);


    try {
      const response = await axios.post(`http://localhost:5000/api/users/follow/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // After successful follow, add the user to the followed set
      setFollowedUsers(prev => new Set(prev).add(userId));
    } catch (err) {
      setError('Error following user');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-black rounded-lg"
        />
        <button type="submit" className="w-full mt-2 bg-primary-600 text-white py-2 rounded-lg">Search</button>
      </form>

      {/* Search Results */}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-4">
        {searchResults.map((user) => (
          <div key={user._id} className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-4">
                <div className="font-bold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user._id)}
              className={`ml-4 px-4 py-2 rounded-lg ${followedUsers.has(user._id) ? 'bg-gray-400' : 'bg-primary-600'} text-white`}
            >
              {followedUsers.has(user._id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFollow;
