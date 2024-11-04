// controllers/notificationController.js

const db = require("../models");
const Notification = db.notifications; // Ensure this matches your models/index.js export
const { Sequelize } = require('sequelize');

/**
 * Create a new notification
 * POST /api/notifications
 */
exports.createNotification = async (req, res) => {
  const { user_id, type, message } = req.body;

  // Basic validation
  if (!user_id || !type || !message) {
    return res.status(400).json({ message: "user_id, type, and message are required." });
  }

  try {
    const newNotification = await Notification.create({
      user_id,
      type,
      message,
      is_read: false, // Default value
      date_time: new Date(), // Current timestamp
    });

    // Emit real-time notification to the user
    const io = req.app.locals.io;
    io.to(`user_${user_id}`).emit("newNotification", newNotification);

    res.status(201).json({
      message: "Notification created successfully.",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification.", error: error.message });
  }
};

/**
 * Get all notifications for a specific user
 * GET /api/notifications/user/:user_id
 */

exports.getUserNotifications = async (req, res) => {
  const { user_id } = req.params;

  try {
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [["date_time", "DESC"]],
      include: [{
        model: db.users, // Ensure this matches your User model name
        attributes: [
          'id',
          // Use Sequelize.fn to concatenate first_name and last_name
          [Sequelize.fn('CONCAT', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'username']
        ],
       
      },{ model: db.posts, attributes: ['id', 'title'] },]
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications.", error: error.message });
  }
};

/**
 * Get a single notification by ID
 * GET /api/notifications/:id
 */
exports.getNotificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ message: "Error fetching notification.", error: error.message });
  }
};

/**
 * Update a notification (e.g., mark as read)
 * PUT /api/notifications/:id
 */
exports.updateNotification = async (req, res) => {
  const { id } = req.params;
  const { type, message, is_read } = req.body;

  try {
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Update fields if they are provided in the request body
    if (type) notification.type = type;
    if (message) notification.message = message;
    if (typeof is_read === "boolean") notification.is_read = is_read;

    await notification.save();

    // Optionally, emit an event if the notification is marked as read
    if (typeof is_read === "boolean") {
      const io = req.app.locals.io;
      io.to(`user_${notification.user_id}`).emit("updateNotification", notification);
    }

    res.status(200).json({
      message: "Notification updated successfully.",
      notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Error updating notification.", error: error.message });
  }
};

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    await notification.destroy();

    // Emit an event if needed (e.g., to notify the user that a notification was deleted)
    const io = req.app.locals.io;
    io.to(`user_${notification.user_id}`).emit("deleteNotification", { id });

    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification.", error: error.message });
  }
};
