// controllers/viewed.controller.js

const db = require("../models");
const Viewed = db.viewed;
const Post = db.posts;
const User = db.users;
const Notification = db.notifications; // Ensure the Notification model is imported
const Sequelize = db.Sequelize; // Access Sequelize through db

// Get all view records
exports.getAllViews = async (req, res) => {
  try {
    const views = await Viewed.findAll({
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        { model: Post, attributes: ['id', 'title', 'user_id'] }, // Include post owner ID
      ],
      order: [['viewedAt', 'DESC']],
    });
    res.status(200).json(views);
  } catch (error) {
    console.error("Error retrieving view records:", error);
    res.status(500).json({ message: "Error retrieving view records", error: error.message });
  }
};

// Add a new view
exports.addView = async (req, res) => {
  const { user_id, post_id } = req.body;

  // Check for required fields
  if (!user_id || !post_id) {
    return res.status(400).json({ message: "User ID and Post ID are required." });
  }

  try {
    // Check if the user exists
    const viewer = await User.findByPk(user_id, {
      attributes: [
        'id',
        'first_name',
        'last_name',
        [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
      ],
    });
    if (!viewer) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the post exists
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Prevent users from viewing their own posts (optional)
    if (post.user_id === user_id) {
      return res.status(400).json({ message: "Users cannot view their own posts." });
    }

    // Create the view record
    const newView = await Viewed.create({
      user_id,
      post_id,
    });

    // Create a notification for the post owner
    const postOwner = await User.findByPk(post.user_id, {
      attributes: [
        'id',
        'first_name',
        'last_name',
        [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
      ],
    });
    if (postOwner) {
      const notification = await Notification.create({
        user_id: postOwner.id, // The user to notify
        type: "views",
        message: `${viewer.get('username')} viewed your post "${post.title}".`,
        date_time: new Date(),
      });

      // Emit real-time event for new notification to the post owner
      const io = req.app.locals.io;
      io.to(`user_${postOwner.id}`).emit("newNotification", notification);
    }

    // Emit real-time event for new view
    const io = req.app.locals.io;
    io.emit("newView", newView); // Broadcast to all connected clients

    res.status(201).json(newView);
  } catch (error) {
    console.error("Error adding view:", error);
    res.status(500).json({ message: "Error adding view", error: error.message });
  }
};

// Get a view record by ID
exports.getViewById = async (req, res) => {
  const { id } = req.params;
  try {
    const view = await Viewed.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        { model: Post, attributes: ['id', 'title'] },
      ],
    });
    if (!view) {
      return res.status(404).json({ message: "View record not found." });
    }
    res.status(200).json(view);
  } catch (error) {
    console.error("Error retrieving view record:", error);
    res.status(500).json({ message: "Error retrieving view record", error: error.message });
  }
};

// Get views by Post ID
exports.getViewsByPostId = async (req, res) => {
  const { post_id } = req.params;
  try {
    const views = await Viewed.findAll({
      where: { post_id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        { model: Post, attributes: ['id', 'title'] },
      ],
      order: [['viewedAt', 'DESC']],
    });
    if (views.length === 0) {
      return res.status(404).json({ message: "No views found for this post." });
    }
    res.status(200).json(views);
  } catch (error) {
    console.error("Error retrieving views for the post:", error);
    res.status(500).json({ message: "Error retrieving views for the post.", error: error.message });
  }
};

// Get views by User ID
exports.getViewsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const views = await Viewed.findAll({
      where: { user_id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        { model: Post, attributes: ['id', 'title'] },
      ],
      order: [['viewedAt', 'DESC']],
    });
    if (views.length === 0) {
      return res.status(404).json({ message: "No views found for this user." });
    }
    res.status(200).json(views);
  } catch (error) {
    console.error("Error retrieving views for the user:", error);
    res.status(500).json({ message: "Error retrieving views for the user.", error: error.message });
  }
};

// Delete a view record by ID
exports.deleteView = async (req, res) => {
  const { id } = req.params;
  try {
    const view = await Viewed.findOne({ where: { id } });
    if (!view) {
      return res.status(404).json({ message: "View record not found." });
    }

    await view.destroy();

    // Emit real-time event for deleted view
    const io = req.app.locals.io;
    io.emit("deleteView", { id }); // Broadcast to all connected clients

    res.status(200).json({ message: "View record deleted successfully." });
  } catch (error) {
    console.error("Error deleting view record:", error);
    res.status(500).json({ message: "Error deleting view record", error: error.message });
  }
};

// Count all views for a specific post
exports.getViewsCountByPostId = async (req, res) => {
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

    // Count the number of views for the post
    const viewCount = await Viewed.count({
      where: { post_id },
    });

    res.status(200).json({ post_id, viewCount });
  } catch (error) {
    console.error("Error counting views:", error);
    res.status(500).json({ message: "Error counting views", error: error.message });
  }
};