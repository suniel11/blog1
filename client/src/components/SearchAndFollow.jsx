import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const SearchAndFollow = () => {
  const [users, setUsers] = useState([]) // All users
  const [filteredUsers, setFilteredUsers] = useState([]) // Filtered users based on search
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [following, setFollowing] = useState({}) // Track following status of each user
  const [searchQuery, setSearchQuery] = useState('') // State for search input

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(response.data)
        setFilteredUsers(response.data) // Initialize filtered users
      } catch (err) {
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleFollow = async (userId) => {
    const token = localStorage.getItem('token')

    try {
      // Check if already following
      if (following[userId]) {
        // Unfollow logic
        await axios.post(
          `http://localhost:5000/api/users/unfollow/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setFollowing((prev) => ({ ...prev, [userId]: false }))
      } else {
        // Follow logic
        await axios.post(
          `http://localhost:5000/api/users/follow/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setFollowing((prev) => ({ ...prev, [userId]: true }))
      }
    } catch (err) {
      console.log(err)
      setError('Failed to follow/unfollow user')
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    // Filter users based on name or email (case insensitive)
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredUsers(filtered)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

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
      {filteredUsers.map((user) => (
        <div key={user._id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            {/* User Profile Image */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600">
              <img
                src={`http://localhost:5000${user.profilePicture}` || 'https://via.placeholder.com/150'}
                alt={`${user.name}'s Profile`}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <Link
                to={`/profile/${user._id}`} // Navigate to user profile page
                className="text-xl font-bold text-white hover:text-blue-400"
              >
                {user.name}
              </Link>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => handleFollow(user._id)}
            className={`px-4 py-2 rounded-lg text-white ${
              following[user._id] ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {following[user._id] ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  )
}

export default SearchAndFollow
