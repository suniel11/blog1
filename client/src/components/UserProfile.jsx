import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
  const { userId } = useParams() // Get the userId from the URL
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUser(response.data)
      } catch (err) {
        setError('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId])

  if (loading) return <div className="text-center text-white">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="w-full h-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg mt-10">
      {user ? (
        <>
          <div className="flex items-center justify-start space-x-6 mb-8">
            {/* User Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
              <img 
                src={`http://localhost:5000${user.profilePicture}` || 'https://via.placeholder.com/150'} 
                alt="User Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{user.name}</h2>
              <p className="text-lg text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* User Info Section */}
          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl text-white">About</h3>
              <p className="text-lg text-gray-400">{user.bio || "This user hasn't added a bio yet."}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl text-white">Friends</h3>
              <ul>
                {user.friends && user.friends.length > 0 ? (
                  user.friends.map((friend, index) => (
                    <li key={index} className="text-lg text-gray-400">{friend.name}</li>
                  ))
                ) : (
                  <li className="text-lg text-gray-400">No friends yet.</li>
                )}
              </ul>
            </div>

            {/* Add any additional sections like posts, hobbies, etc. */}
            <div className="space-y-2">
              <h3 className="text-2xl text-white">Recent Posts</h3>
              {user.posts && user.posts.length > 0 ? (
                user.posts.map((post, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <p className="text-lg text-white">{post.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-lg text-gray-400">No posts yet.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-white">User not found.</div>
      )}
    </div>
  )
}

export default UserProfile
