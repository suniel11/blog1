import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ post, onLikeToggle, onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    try {
      // Call onLikeToggle, which handles both like and unlike
      await onLikeToggle(post._id);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await onAddComment(post._id, commentText);
      setCommentText(''); // Clear comment input
        console.log(commentText.name)
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  // Determine if the current user has liked the post
  const hasLiked = post.likes.includes(localStorage.getItem('userId'));

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md flex flex-col space-y-2">
      <div className="flex items-center space-x-4">
        <img
          src={`http://localhost:5000${post.userId.profilePicture}`}
          alt={`${post.userId.name}'s profile`}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-300">{post.userId.name}</span>
      </div>
      <div className="space-y-2 w-1/2">
      <p className="text-gray-300">{post.description}</p>
      {post.image && (
        <img
          src={`http://localhost:5000${post.image}`}
          alt="Post"
          className="rounded-lg"
        />
      )}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`text-sm ${hasLiked ? 'text-red-500' : 'text-gray-400'}`}
        >
          {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
        </button>
      </div>
      <div>
        <form onSubmit={handleAddComment} className="flex space-x-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-2 py-1 text-sm rounded-lg bg-gray-700 text-white"
          />
          <button type="submit" className="px-4 py-1 text-sm bg-blue-600 text-white rounded-lg">
            Comment
          </button>
        </form>
        </div>
      </div>
      <div className="text-gray-400 text-sm space-y-2">
        {post.comments.map((comment) => (
          <div key={comment._id} className="flex space-x-2">
            <span>{comment.name}:</span>
            <span>{comment.comment}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default PostForm;