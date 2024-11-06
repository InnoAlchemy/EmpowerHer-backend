// controllers/posts.controller.js

const db = require("../models");
const Post = db.posts;
const User = db.users;
const Notification = db.notifications; // Import the Notification model
const Sequelize = db.Sequelize;

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ['id',[Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Error retrieving posts", error: error.message });
  }
};

// Add a new post
exports.addPost = async (req, res) => {
  const { user_id, title, content, status } = req.body;

  // Check for required fields
  if (!user_id || !title || !content) {
    return res.status(400).json({ message: "User ID, title, and content are required." });
  }

  // Construct the media_url based on the environment if media is uploaded
  const media_url = req.file
    ? process.env.NODE_ENV === "production"
      ? `https://your-production-domain.com/${req.file.path.replace(/\\/g, "/")}`
      : `http://localhost:8080/${req.file.path.replace(/\\/g, "/")}`
    : null;

  try {
    // Check if the user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPost = await Post.create({
      user_id,
      title,
      content,
      media_url,
      status,
    });

    // Create a notification for the post creator
    const notification = await Notification.create({
      user_id: user.id,
      type: "posts",
      message: `You created a new post titled "${title}".`,
      date_time: new Date(),
    });

    // Emit real-time notification to the post creator
    const io = req.app.locals.io;
    io.to(`user_${notification.user_id}`).emit("newNotification", notification);

    // Emit real-time event for new post (optional, if you need this)
    // io.emit("newPost", newPost); // Broadcast to all connected clients

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ message: "Error adding post", error: error.message });
  }
};
// Get a post by ID
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
      ],
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ message: "Error retrieving post", error: error.message });
  }
};

// Update post details
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;

  try {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Update fields that are present in the request body
    if (req.file) {
      post.media_url = process.env.NODE_ENV === "production"
        ? `https://your-production-domain.com/${req.file.path.replace(/\\/g, "/")}`
        : `http://localhost:8080/${req.file.path.replace(/\\/g, "/")}`;
    }
    if (title !== undefined) {
      post.title = title;
    }
    if (content !== undefined) {
      post.content = content;
    }
    if (status !== undefined) {
      post.status = status;
    }

    // Save the updated post
    await post.save();

    // Create a notification for the post creator
    const notification = await Notification.create({
      user_id: post.user_id,
      type: "posts",
      message: `You updated your post titled "${post.title}".`,
      date_time: new Date(),
    });

    // Emit real-time notification to the post creator
    const io = req.app.locals.io;
    io.to(`user_${notification.user_id}`).emit("newNotification", notification);

    // Emit real-time event for updated post (optional, if you need this)
    // io.emit("updatePost", post); // Broadcast to all connected clients

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};

// Get all posts by user_id
exports.getPostsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const posts = await Post.findAll({
      where: { user_id },
      include: [
        { model: User, attributes: ['id', [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'username'],] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts by user_id:", error);
    res.status(500).json({ message: "Error retrieving posts by user_id", error: error.message });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Store post title before deletion for notification
    const postTitle = post.title;

    await post.destroy();

    // Fetch all users except the post deleter
    const usersToNotify = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: post.user_id, // Not equal to post owner's ID
        },
      },
    });

    // Prepare notifications data
    const notificationsData = usersToNotify.map(user => ({
      user_id: user.id,
      type: "posts",
      message: `Post titled "${postTitle}" has been deleted.`,
      date_time: new Date(),
    }));

    // Bulk create notifications
    const notifications = await Notification.bulkCreate(notificationsData);

    // Emit real-time notifications to each user
    const io = req.app.locals.io;
    notifications.forEach(notification => {
      io.to(`user_${notification.user_id}`).emit("newNotification", notification);
    });

    // Emit real-time event for deleted post
    io.emit("deletePost", { id }); // Broadcast to all connected clients

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};
