import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem'; // Import AddPostForm

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  const handleLikeToggle = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: response.data.comments }
            : post
        )
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAdded = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* AddPostForm at the top */}
      <PostItem onPostAdded={handlePostAdded} />
      
      {/* Posts */}
      {posts.map((post) => (
        <PostForm
          key={post._id}
          post={post}
          onLikeToggle={handleLikeToggle}
          onAddComment={handleAddComment}
        />
      ))}
    </div>
  );
};

export default Timeline;
