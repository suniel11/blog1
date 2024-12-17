import React, { useEffect, useState } from 'react'
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg mt-10">
      {user ? (
        <>
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg p-8 text-white text-center">
            <h1 className="text-4xl font-semibold">{user.name}</h1>
            <p className="text-lg text-gray-300">{user.email}</p>
          </div>

          {/* Profile Image and Bio */}
          <div className="flex flex-col items-center justify-center mt-6 space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
              <img 
                src={`http://localhost:5000${user.profilePicture}` || 'https://via.placeholder.com/150'} 
                alt="User Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="text-white text-sm">{user.bio || 'No bio available'}</p>
          </div>

          {/* Follow/Unfollow Button */}
          <div className="flex justify-center mt-6">
            <button className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Follow
            </button>
          </div>

          {/* Friends Section */}
          <div className="mt-8">
            <h3 className="text-xl text-white mb-4">Friends</h3>
            <div className="grid grid-cols-3 gap-4">
              {user.friends && user.friends.length > 0 ? (
                user.friends.map((friend, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700">
                      <img 
                        src={`http://localhost:5000${friend.profilePicture}` || 'https://via.placeholder.com/40'} 
                        alt="Friend" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="text-sm text-gray-400">{friend.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No friends yet.</p>
              )}
            </div>
          </div>

          {/* Posts Section */}
          <div className="mt-8">
            <h3 className="text-xl text-white mb-4">Recent Posts</h3>
            {user.posts && user.posts.length > 0 ? (
              user.posts.map((post, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
                  <h4 className="text-lg text-white font-semibold">{post.title}</h4>
                  <p className="text-sm text-gray-400">{post.body}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No posts yet.</p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-white">User not found.</div>
      )}
    </div>
  )
}

export default UserProfile
