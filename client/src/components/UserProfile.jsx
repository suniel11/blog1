import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "./PostForm";


const UserProfile = () => {
  const { userId } = useParams(); // Get userId from URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // State for storing user posts
  const [following, setFollowing] = useState(false); // Track if the current user is following this user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate hook to handle navigation

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Unauthorized access");
        }

        // Fetch the user profile
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedUser = response.data;

        // Fetch posts of the user
        const postsResponse = await axios.get(`http://localhost:5000/api/posts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(postsResponse.data); // Set the posts fetched

        // Assuming that `currentUserId` is fetched dynamically (e.g., from the token or a separate endpoint)
        const currentUserResponse = await axios.get(`http://localhost:5000/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUserId = currentUserResponse.data._id;

        // Check if the logged-in user is following this user
        const isFollowing = fetchedUser.followers.includes(currentUserId);
        setUser(fetchedUser);
        setFollowing(isFollowing);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);




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

      console.log("Response data:", response.data);

      // Update the post's like status in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
      console.log(response.data)
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




  const handleMessageClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const loggedInUserId = localStorage.getItem("userId"); // ID of the logged-in user
  
      if (!token || !loggedInUserId) {
        console.error("User must be logged in to message.");
        return;
      }
  
      // Fetch all conversations for the logged-in user
      const response = await axios.get("http://localhost:5000/api/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const conversations = response.data;
  
      // Check if a conversation exists between the logged-in user and the profile user
      const existingConversation = conversations.find((conversation) =>
        conversation.participants.some((participant) => participant._id === userId) && // `userId` is the profile owner's ID
        conversation.participants.some((participant) => participant._id === loggedInUserId)
      );
  
      if (existingConversation) {
        // Navigate to the existing conversation
        navigate(`/messages/${existingConversation._id}`);
      } else {
        // No conversation exists, create one
        const newConversationResponse = await axios.post(
          "http://localhost:5000/api/conversations",
          { participants: [loggedInUserId, userId] }, // Pass both user IDs
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const newConversation = newConversationResponse.data;
  
        // Navigate to the newly created conversation
        navigate(`/messages/${newConversation._id}`);
      }
    } catch (error) {
      console.error("Error handling message action:", error.response?.data || error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg mt-10">
      <div className="flex items-center justify-start space-x-4 mb-6">
        {/* User Profile Image */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700">
          <img
            src={`http://localhost:5000${user.profilePicture}` || "https://via.placeholder.com/150"}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">{user.name}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
          <p className="text-sm text-gray-400">Following: {user.following.length}</p>
          <p className="text-sm text-gray-400">Followers: {user.followers.length}</p>
        </div>
      </div>

      {/* Show Message Button */}
      {following ? (
        <button
          onClick={handleMessageClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4 hover:bg-blue-600"
        >
          Message
        </button>
      ) : (
        <div className="text-gray-400 mt-4">You are not following this user.</div>
      )}

      {/* User Posts */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-white mb-4">Posts</h3>
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-gray-800 p-4 rounded-lg mb-4">
              <h4 className="text-xl font-semibold text-white">{post.description}</h4>
              <PostForm
          key={post._id}
          post={post}
          onLikeToggle={handleLikeToggle}
          onAddComment={handleAddComment}
        />              
        {/* {post.image && (
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            className="rounded-lg  flex"
          />  
        )}    */}

            </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default UserProfile;
