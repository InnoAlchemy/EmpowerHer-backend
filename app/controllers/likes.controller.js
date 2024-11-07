// controllers/like.controller.js

const db = require("../models");
const Like = db.likes;
const Post = db.posts;
const User = db.users;
const Notification = db.notifications; // Import the Notification model
const Sequelize = db.Sequelize;

// Get all likes
exports.getAllLikes = async (req, res) => {
  try {
    const likes = await Like.findAll({
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
        { model: Post, attributes: ['id', 'title', 'user_id'] }, // Include post owner ID
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving likes", error: error.message });
  }
};

// Add a new like
exports.addLike = async (req, res) => {
  const { user_id, post_id } = req.body;

  // Check for required fields
  if (!user_id || !post_id) {
    return res.status(400).json({ message: "User ID and Post ID are required." });
  }

  try {
    // Check if the user exists
    const liker = await User.findByPk(user_id);
    if (!liker) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the post exists
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Prevent users from liking their own posts (optional)
    if (post.user_id === user_id) {
      return res.status(400).json({ message: "Users cannot like their own posts." });
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ where: { user_id, post_id } });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post." });
    }

    // Create the like record
    const newLike = await Like.create({
      user_id,
      post_id,
    });

    // Create a notification for the post owner
    const postOwner = await User.findByPk(post.user_id);
    if (postOwner) {
      const notification = await Notification.create({
        user_id: postOwner.id, // The user to notify
        post_id: post.id,
        type: "likes",
        message: `${liker.first_name} liked your post "${post.title}".`,
      });

      // Emit real-time event for new notification to the post owner
      const io = req.app.locals.io;
      io.to(`user_${postOwner.id}`).emit("newNotification", notification);
    }

    // Emit real-time event for new like
    const io = req.app.locals.io;
    io.emit("newLike", newLike); // Broadcast to all connected clients

    res.status(201).json(newLike);
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ message: "Error adding like", error: error.message });
  }
};

// Get a like by ID
exports.getLikeById = async (req, res) => {
  const { id } = req.params;
  try {
    const like = await Like.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
        { model: Post, attributes: ['id', 'title'] },
      ],
    });
    if (!like) {
      return res.status(404).json({ message: "Like not found." });
    }
    res.status(200).json(like);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving like", error: error.message });
  }
};

// Get likes by Post ID
exports.getLikesByPostId = async (req, res) => {
  const { post_id } = req.params;
  try {
    const likes = await Like.findAll({
      where: { post_id },
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
        { model: Post, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (likes.length === 0) {
      return res.status(404).json({ message: "No likes found for this post." });
    }
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving likes for the post.", error: error.message });
  }
};

// Get likes by User ID
exports.getLikesByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const likes = await Like.findAll({
      where: { user_id },
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
        { model: Post, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (likes.length === 0) {
      return res.status(404).json({ message: "No likes found for this user." });
    }
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving likes for the user.", error: error.message });
  }
};

// Remove a like
exports.removeLike = async (req, res) => {
  const { user_id, post_id } = req.body;

  // Check for required fields
  if (!user_id || !post_id) {
    return res.status(400).json({ message: "User ID and Post ID are required." });
  }

  try {
    const like = await Like.findOne({ where: { user_id, post_id } });
    if (!like) {
      return res.status(404).json({ message: "Like not found." });
    }

    await like.destroy();

    // Emit real-time event for removed like
    const io = req.app.locals.io;
    io.emit("removeLike", { user_id, post_id }); // Broadcast to all connected clients

    res.status(200).json({ message: "Like removed successfully." });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ message: "Error removing like", error: error.message });
  }
};

// Get likes by Post ID along with the count
exports.getLikesCountByPostId = async (req, res) => {
  const { post_id } = req.params;
  try {
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const likes = await Like.findAll({
      where: { post_id },
      include: [
        { 
          model: User, 
          attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username']],
        },
        { model: Post, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const likeCount = await Like.count({ where: { post_id } });

    if (likes.length === 0) {
      return res.status(404).json({ message: "No likes found for this post.", likeCount });
    }

    res.status(200).json({ likeCount, likes });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving likes for the post.", error: error.message });
  }
};