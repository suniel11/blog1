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

  const handleLikeToggle = async (postId, hasLiked) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("No token or userId found");
      }

      const endpoint = hasLiked
        ? `http://localhost:5000/api/posts/${postId}/unlike`
        : `http://localhost:5000/api/posts/${postId}/like`;

      console.log("Sending request to:", endpoint);
      console.log("Request body:", { userId });

      const response = await axios.post(
        endpoint,
        { userId }, // Include userId in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Response data:", response.data);

      // Update the post's like status in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);

      if (err.response && err.response.data.error === "You have already liked this post") {
        try {
          // Attempt to unlike the post automatically
          const unlikeEndpoint = `http://localhost:5000/api/posts/${postId}/unlike`;

          const unlikeResponse = await axios.post(
            unlikeEndpoint,
            { userId: localStorage.getItem("userId") }, // Include userId in the body
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log("Unlike response data:", unlikeResponse.data);

          // Update the post's like status in the state
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId ? { ...post, likes: unlikeResponse.data.likes } : post
            )
          );
        } catch (unlikeErr) {
          console.error("Error unliking post:", unlikeErr);
        }
      }
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
