import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch profile data
        const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(profileResponse.data);

        // Fetch user's posts
        const postsResponse = await axios.get('http://localhost:5000/api/posts/my-posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(postsResponse.data);
      } catch (err) {
        setError('Failed to fetch profile or posts data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/posts/${editPostId}`,
        { description: editDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === editPostId ? { ...post, description: response.data.description } : post
        )
      );
      setEditPostId(null); // Exit edit mode
    } catch (err) {
      console.error('Failed to edit post:', err);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold my-4">Profile</h1>
      {profileData && (
        <div className="text-center">
          <img
            src={`http://localhost:5000${profileData.profilePicture}`}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-primary-600 mb-4"
          />
          <h2 className="text-lg font-medium">{profileData.name}</h2>
          <p className="text-sm text-gray-400">Email: {profileData.email}</p>
          <p className="text-sm text-gray-400">
            Account Created On: {new Date(profileData.createdOn).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="w-full max-w-2xl mt-6 space-y-4">
        <h2 className="text-lg font-bold">Your Posts</h2>
        {posts.map((post) => (
          <div
            key={post._id}
            className="p-4 bg-gray-800 rounded-lg shadow-md flex flex-col space-y-2"
          >
            {editPostId === post._id ? (
              <form onSubmit={handleEditPost} className="space-y-2">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-1 text-white bg-blue-600 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPostId(null)}
                    className="px-4 py-1 text-white bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-gray-300">{post.description}</p>
                {post.image && (
                  <img
                    src={`http://localhost:5000${post.image}`}
                    alt="Post"
                    className="w-full rounded-lg"
                  />
                )}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'} |{' '}
                    {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditPostId(post._id);
                        setEditDescription(post.description);
                      }}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-sm text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-6"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;
