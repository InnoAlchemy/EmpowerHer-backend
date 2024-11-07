// controllers/comment.controller.js

const db = require("../models");
const Comment = db.comments;
const Post = db.posts;
const User = db.users;
const Notification = db.notifications; // Import the Notification model
const Sequelize = db.Sequelize;

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
        { model: Post, attributes: ['id', 'title', 'user_id'] }, // Include post owner ID
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments", error: error.message });
  }
};

// Add a new comment
exports.addComment = async (req, res) => {
  const { user_id, post_id, content } = req.body;

  // Check for required fields
  if (!user_id || !post_id || !content) {
    return res.status(400).json({ message: "User ID, Post ID, and content are required." });
  }

  try {
    // Check if the user exists
    const commenter = await User.findByPk(user_id);
    if (!commenter) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the post exists
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Create the comment record
    const newComment = await Comment.create({
      user_id,
      post_id,
      content,
    });

    // Fetch post owner information
    const postOwner = await User.findByPk(post.user_id);

    // Create a notification for the post owner if the commenter is not the post owner
    let notification = null;
    if (postOwner && postOwner.id !== user_id) { // Prevent notifying self
      notification = await Notification.create({
        user_id: postOwner.id, // The user to notify
        post_id: post.id, // Reference to the post
        type: "comment",
        message: `${commenter.first_name} ${commenter.last_name} commented on your post "${post.title}".`,
      });

      // Emit real-time event for new notification to the post owner
      const io = req.app.locals.io;
      io.to(`user_${postOwner.id}`).emit("newNotification", notification);
    }

    // Emit real-time event for new comment to relevant users
    const io = req.app.locals.io;
    io.to(`post_${post_id}`).emit("newComment", newComment); // Emit to the post's room

    res.status(201).json({ newComment, notification });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// Get a comment by ID
exports.getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
        { model: Post, attributes: ['id', 'title'] },
      ],
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comment", error: error.message });
  }
};

// Get comments by Post ID
exports.getCommentsByPostId = async (req, res) => {
  const { post_id } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { post_id },
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
        { model: Post, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this post." });
    }
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments for the post.", error: error.message });
  }
};

// Get comments by User ID
exports.getCommentsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { user_id },
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
        { model: Post, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this user." });
    }
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments for the user.", error: error.message });
  }
};

// Update a comment by ID

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { user_id } = req.body; // Assuming the user performing the update is sent in the request

  // Check if content is provided
  if (!content) {
    return res.status(400).json({ message: "Content is required to update the comment." });
  }

  try {
    const comment = await Comment.findOne({ where: { id }, include: [{ model: Post }] });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Optionally, verify that the user has permission to update the comment
    if (comment.user_id !== user_id) {
      return res.status(403).json({ message: "You do not have permission to update this comment." });
    }

    // Update the content
    comment.content = content;

    // Save the updated comment
    await comment.save();

    // Fetch commenter and post owner information
    const commenter = await User.findByPk(comment.user_id);
    const postOwner = await User.findByPk(comment.Post.user_id);

    // Create a notification for the post owner if the commenter is not the post owner
    let notification = null;
    if (postOwner && postOwner.id !== comment.user_id) { // Prevent notifying self
      notification = await Notification.create({
        user_id: postOwner.id, // The user to notify
        post_id: comment.post_id, // Reference to the post
        type: "comment_update",
        message: `${commenter.first_name} ${commenter.last_name} updated a comment on your post "${comment.Post.title}".`,
      });

      // Emit real-time event for updated notification to the post owner
      const io = req.app.locals.io;
      io.to(`user_${postOwner.id}`).emit("newNotification", notification);
    }

    // Emit real-time event for updated comment to relevant users
    const io = req.app.locals.io;
    io.to(`post_${comment.post_id}`).emit("updateComment", comment); // Emit to the post's room

    res.status(200).json({ comment, notification });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};
// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    await comment.destroy();

    // Emit real-time event for deleted comment
    const io = req.app.locals.io;
    io.emit("deleteComment", { id }); // Broadcast to all connected clients

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

// **New Method:** Count all comments for a specific post
exports.countCommentsForPost = async (req, res) => {
  const { post_id } = req.params;

  // Validate the post_id
  if (!post_id) {
    return res.status(400).json({ message: "Post ID is required." });
  }

  try {
    // Check if the post exists
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Count the number of comments for the post
    const commentCount = await Comment.count({
      where: { post_id },
    });

    res.status(200).json({ post_id, commentCount });
  } catch (error) {
    console.error("Error counting comments:", error);
    res.status(500).json({ message: "Error counting comments", error: error.message });
  }
};