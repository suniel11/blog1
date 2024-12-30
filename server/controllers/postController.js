// controllers/postController.js

const Post = require("../models/Post");
const mongoose = require('mongoose');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const  {description} = req.body;
    const userId = req.user._id;
    const user = req.user.name;
 
    // Get description and userId from the request body
    const newPost = new Post({
      description,
      userId,
      user,
      image: req.file ? `/uploads/photos/${req.file.filename}` : null, // Handle image upload if provided
    });

    await newPost.save();

    res.status(201).json(newPost);
    console.log(user) // Return the created post
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Update an existing post
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the postId from the URL params
    const { description } = req.body; // Get the description from the request body

    const post = await Post.findById(postId); // Find the post by its ID
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the post fields
    post.description = description || post.description;
    post.image = req.file ? `/uploads/photos/${req.file.filename}` : post.image;

    await post.save();
    res.status(200).json(post); // Return the updated post
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update post" });
  }
};

// controllers/postController.js

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().populate("userId", "name profilePicture"); // Populate user data
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };
  

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the postId from the URL params

    const post = await Post.findById(postId); // Find the post by its ID
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.deleteOne(); // Delete the post
    res.status(200).json({ message: "Post deleted successfully" }); // Return success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Ensure user is not already in likes array
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: "You have already liked this post" });
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like post" });
  }
};


// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Validate postId and userId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure user is in likes array before removing
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    post.likes = post.likes.filter((like) => like && like.toString() !== userId);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error("Error in unlikePost controller:", err);
    res.status(500).json({ error: "Failed to unlike post", details: err.message });
  }
};

exports.userPosts = async (req, res) => {
  try {
    const userId = req.params.userId;  // Extract userId from route parameters

    // Fetch posts by userId
    const posts = await Post.find({ userId }).populate('userId', 'name email');  // Populate user details if needed

    if (!posts) {
      return res.status(404).json({ message: "Posts not found for this user" });
    }

    res.status(200).json(posts);  // Return posts
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
}






// Comment on a post
exports.commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the postId from the URL params
    const {  comment } = req.body; // Get userId and comment from the request body
    const user = req.user
    const post = await Post.findById(postId); // Find the post by its ID
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create a new comment
    const newComment = {
      userId : req.user._id,
      comment,
      name : req.user.name
      
    };

    post.comments.push(newComment); // Add the new comment to the post
    await post.save();
    console.log(user.name)

    res.status(200).json(post); // Return the updated post with the new comment
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to comment on post" });
  }
};

exports.getUserPosts = async (req, res) => {
  const userId = req.user._id; // Assuming you are using middleware to attach user data to the request.
  try {
    const userPosts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user posts', details: err.message });
  }
};
