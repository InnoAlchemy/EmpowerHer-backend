// controllers/share.controller.js

const db = require("../models");
const Share = db.shares;
const Post = db.posts;
const User = db.users;
const Notification = db.notifications;
const Sequelize = db.Sequelize;

// Get all shares
exports.getAllShares = async (req, res) => {
  try {
    const shares = await Share.findAll({
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        {
          model: Post,
          attributes: ['id', 'title', 'user_id'],
        },
      ],
      order: [['sharedAt', 'DESC']],
    });
    res.status(200).json(shares);
  } catch (error) {
    console.error("Error retrieving shares:", error);
    res.status(500).json({ message: "Error retrieving shares", error: error.message });
  }
};

// Add a new share
exports.addShare = async (req, res) => {
  const { user_id, post_id } = req.body;

  // Check for required fields
  if (!user_id || !post_id) {
    return res.status(400).json({ message: "User ID and Post ID are required." });
  }

  try {
    // Check if the user exists
    const sharer = await User.findByPk(user_id, {
      attributes: [
        'id',
        'first_name',
        'last_name',
        [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
      ],
    });
    if (!sharer) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the post exists
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Prevent users from sharing their own posts (optional)
    if (post.user_id === user_id) {
      return res.status(400).json({ message: "Users cannot share their own posts." });
    }

    // Check if the share already exists (optional)
    // For example, prevent multiple shares of the same post by the same user
    const existingShare = await Share.findOne({ where: { user_id, post_id } });
    if (existingShare) {
      return res.status(400).json({ message: "You have already shared this post." });
    }

    // Create the share record
    const newShare = await Share.create({
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
        type: "shares",
        message: `${sharer.get('username')} shared your post "${post.title}".`,
        date_time: new Date(),
      });

      // Emit real-time event for new notification to the post owner
      const io = req.app.locals.io;
      io.to(`user_${postOwner.id}`).emit("newNotification", notification);
    }

    // Emit real-time event for new share
    const io = req.app.locals.io;
    io.emit("newShare", newShare); // Broadcast to all connected clients

    res.status(201).json(newShare);
  } catch (error) {
    console.error("Error adding share:", error);
    res.status(500).json({ message: "Error adding share", error: error.message });
  }
};

// Get a share by ID
exports.getShareById = async (req, res) => {
  const { id } = req.params;
  try {
    const share = await Share.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        {
          model: Post,
          attributes: ['id', 'title'],
        },
      ],
    });
    if (!share) {
      return res.status(404).json({ message: "Share not found." });
    }
    res.status(200).json(share);
  } catch (error) {
    console.error("Error retrieving share:", error);
    res.status(500).json({ message: "Error retrieving share", error: error.message });
  }
};

// Get shares by Post ID
exports.getSharesByPostId = async (req, res) => {
  const { post_id } = req.params;
  try {
    const shares = await Share.findAll({
      where: { post_id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        {
          model: Post,
          attributes: ['id', 'title'],
        },
      ],
      order: [['sharedAt', 'DESC']],
    });
    if (shares.length === 0) {
      return res.status(404).json({ message: "No shares found for this post." });
    }
    res.status(200).json(shares);
  } catch (error) {
    console.error("Error retrieving shares for the post:", error);
    res.status(500).json({ message: "Error retrieving shares for the post.", error: error.message });
  }
};

// Get shares by User ID
exports.getSharesByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const shares = await Share.findAll({
      where: { user_id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        {
          model: Post,
          attributes: ['id', 'title'],
        },
      ],
      order: [['sharedAt', 'DESC']],
    });
    if (shares.length === 0) {
      return res.status(404).json({ message: "No shares found for this user." });
    }
    res.status(200).json(shares);
  } catch (error) {
    console.error("Error retrieving shares for the user:", error);
    res.status(500).json({ message: "Error retrieving shares for the user.", error: error.message });
  }
};

// Delete a share by ID
exports.deleteShare = async (req, res) => {
  const { id } = req.params;
  try {
    const share = await Share.findOne({ where: { id } });
    if (!share) {
      return res.status(404).json({ message: "Share record not found." });
    }

    await share.destroy();

    // Emit real-time event for deleted share
    const io = req.app.locals.io;
    io.emit("deleteShare", { id }); // Broadcast to all connected clients

    res.status(200).json({ message: "Share record deleted successfully." });
  } catch (error) {
    console.error("Error deleting share record:", error);
    res.status(500).json({ message: "Error deleting share record", error: error.message });
  }
};

// Get shares by Post ID along with the count
exports.getSharesCountByPostId = async (req, res) => {
  const { post_id } = req.params;
  try {
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const shares = await Share.findAll({
      where: { post_id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],
          ],
        },
        {
          model: Post,
          attributes: ['id', 'title'],
        },
      ],
      order: [['sharedAt', 'DESC']],
    });

    const shareCount = await Share.count({ where: { post_id } });

    if (shares.length === 0) {
      return res.status(404).json({ message: "No shares found for this post.", shareCount });
    }

    res.status(200).json({ shareCount, shares });
  } catch (error) {
    console.error("Error retrieving shares for the post:", error);
    res.status(500).json({ message: "Error retrieving shares for the post.", error: error.message });
  }
};