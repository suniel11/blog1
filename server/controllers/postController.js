// controllers/postController.js

const Post = require("../models/Post");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const  {description} = req.body;
    const userId = req.user._id;
     // Get description and userId from the request body
    const newPost = new Post({
      description,
      userId,
      image: req.file ? `/uploads/photos/${req.file.filename}` : null, // Handle image upload if provided
    });

    await newPost.save();
    res.status(201).json(newPost); // Return the created post
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

    await post.remove(); // Delete the post
    res.status(200).json({ message: "Post deleted successfully" }); // Return success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the postId from the URL params
    const { userId } = req.body; // Get the userId from the request body

    const post = await Post.findById(postId); // Find the post by its ID
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: "You have already liked this post" });
    }

    // Add the user to the likes array
    post.likes.push(userId);
    await post.save();

    res.status(200).json(post); // Return the updated post
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like post" });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the postId from the URL params
    const { userId } = req.body; // Get the userId from the request body

    const post = await Post.findById(postId); // Find the post by its ID
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Remove the user from the likes array
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();

    res.status(200).json(post); // Return the updated post
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unlike post" });
  }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the postId from the URL params
    const { userId, comment } = req.body; // Get userId and comment from the request body

    const post = await Post.findById(postId); // Find the post by its ID
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create a new comment
    const newComment = {
      userId,
      comment,
    };

    post.comments.push(newComment); // Add the new comment to the post
    await post.save();

    res.status(200).json(post); // Return the updated post with the new comment
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to comment on post" });
  }
};
