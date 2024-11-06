// controllers/chatController.js

const db = require("../models");
const Chat = db.chats;
const User = db.users;
const Notification = db.notifications; 
const { Op, fn, col, where, literal } = db.Sequelize;

exports.getConnectionStatus = async (req, res) => {
  const { sender_id, receiver_id } = req.body; // IDs of the two users to check connection status between

  if (!sender_id || !receiver_id) {
    return res.status(400).json({ message: "Both sender_id and receiver_id are required in the request body." });
  }

  try {
    // Check if a connection exists between the two specified users
    const connection = await Chat.findOne({
      where: {
        [Op.or]: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
        type: "connection",
      },
    });

    if (connection) {
      if (connection.status === "accepted") {
        return res.status(200).json({ status: "connected" });
      } else if (connection.status === "request") {
        const status = connection.sender_id === sender_id ? "requested" : "pending"; 
        return res.status(200).json({ status });
      }
    }

    // No connection found
    return res.status(200).json({ status: "connect" }); 

  } catch (error) {
    console.error("Error getting connection status:", error);
    res.status(500).json({ message: "Error getting connection status", error: error.message });
  }
};


// Send a connection request
exports.sendConnectionRequest = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  if (sender_id === receiver_id) {
    return res.status(400).json({ message: "You cannot connect with yourself." });
  }

  try {
    // Check if a connection request already exists in either direction
    const existingRequest = await Chat.findOne({
      where: {
        [Op.or]: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
        type: "connection",
        status: { [Op.in]: ["request", "accepted"] },
      },
    });

    if (existingRequest) {
      if (existingRequest.status === "request") {
        return res.status(400).json({ message: "A connection request is already pending." });
      } else if (existingRequest.status === "accepted") {
        return res.status(400).json({ message: "You are already connected." });
      }
    }

    // Create a new connection request with status "request"
    const newRequest = await Chat.create({
      type: "connection",
      sender_id,
      receiver_id,
      status: "request",
      is_connected: false,
    });

    // Fetch sender information
    const senderInfo = await User.findOne({ where: { id: sender_id } });

    // Create a notification for the receiver
    const notification = await Notification.create({
      user_id: receiver_id, // The user to notify
      chat_id: newRequest.id, // Reference to the connection request
      type: "connection_request",
      message: `${senderInfo.first_name} ${senderInfo.last_name} has sent you a connection request.`,
    });

    // Emit real-time event to the receiver about the new connection request
    const io = req.app.locals.io;
    io.to(`user_${receiver_id}`).emit("newConnectionRequest", {
      from: senderInfo,
      request: newRequest,
      notification, // Optionally send the notification data
    });

    // Optionally emit the notification as a separate event
    io.to(`user_${receiver_id}`).emit("newNotification", notification);

    res.status(201).json({
      message: "Connection request sent.",
      request: newRequest,
      sender: senderInfo,
      notification,
    });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ message: "Error sending connection request", error: error.message });
  }
};


// Accept or reject a connection request
exports.respondToConnectionRequest = async (req, res) => {
  const { sender_id, receiver_id, action } = req.body;

  try {
    // Find the pending connection request
    const request = await Chat.findOne({
      where: {
        sender_id,
        receiver_id,
        type: "connection",
        status: "request",
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    // Fetch receiver information
    const receiverInfo = await User.findOne({ where: { id: receiver_id } });

    let notification;
    if (action === "accept") {
      request.status = "accepted";
      request.is_connected = true;
      await request.save();

      // Create a notification for the sender
      notification = await Notification.create({
        user_id: sender_id, // The user to notify
        chat_id: request.id,
        type: "connection_accepted",
        message: `${receiverInfo.first_name} ${receiverInfo.last_name} has accepted your connection request.`,
      });

      // Emit real-time event to the sender about the acceptance
      const io = req.app.locals.io;
      io.to(`user_${sender_id}`).emit("connectionAccepted", {
        by: receiverInfo,
        request,
        notification,
      });

      // Optionally emit the notification as a separate event
      io.to(`user_${sender_id}`).emit("newNotification", notification);

      return res.status(200).json({ message: "Connection request accepted.", request, notification });
    } else if (action === "reject") {
      request.status = "rejected";
      request.is_connected = false;
      await request.save();

      // Create a notification for the sender
      notification = await Notification.create({
        user_id: sender_id,
        chat_id: request.id,
        type: "connection_rejected",
        message: `${receiverInfo.first_name} ${receiverInfo.last_name} has rejected your connection request.`,
      });

      // Emit real-time event to the sender about the rejection
      const io = req.app.locals.io;
      io.to(`user_${sender_id}`).emit("connectionRejected", {
        by: receiverInfo,
        request,
        notification,
      });

      // Optionally emit the notification as a separate event
      io.to(`user_${sender_id}`).emit("newNotification", notification);

      return res.status(200).json({ message: "Connection request rejected.", request, notification });
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'accept' or 'reject'." });
    }
  } catch (error) {
    console.error("Error updating connection status:", error);
    res.status(500).json({ message: "Error updating connection status", error: error.message });
  }
};


// Send a message between connected users
exports.sendMessage = async (req, res) => {
  const { content, sender_id, receiver_id } = req.body;

  // Validate required fields
  if (!content || !sender_id || !receiver_id) {
    return res.status(400).json({ message: "Content, Sender ID, and Receiver ID are required." });
  }

  try {
    // Check if the users are connected
    const connected = await Chat.findOne({
      where: {
        sender_id: sender_id,
        receiver_id: receiver_id,
        type: "connection",
        is_connected: true,
      },
    });

    if (!connected) {
      return res.status(403).json({ message: "Users are not connected." });
    }

    // Create the new message
    const newMessage = await Chat.create({
      type: "message",
      is_connected: true,
      content,
      sender_id,
      receiver_id,
      date_time: new Date(),
    });

    // Fetch sender information
    const senderInfo = await User.findOne({ where: { id: sender_id } });

    // Create a notification for the receiver
    const notification = await Notification.create({
      user_id: receiver_id, // The user to notify
      chat_id: newMessage.id, // Reference to the message
      type: "message",
      message: `${senderInfo.first_name} ${senderInfo.last_name} sent you a message: "${content}".`,
    });

    // Emit real-time event to the receiver about the new message
    const io = req.app.locals.io;
    io.to(`user_${receiver_id}`).emit("newMessage", newMessage);

    // Emit a separate real-time event for the notification
    io.to(`user_${receiver_id}`).emit("newNotification", notification);

    res.status(201).json({ message: "Message sent successfully.", newMessage, notification });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// Retrieve messages between two users
exports.getMessages = async (req, res) => {
  const { sender_id, receiver_id } = req.params;

  try {
    // Fetch messages where the sender and receiver match (in either direction)
    const messages = await Chat.findAll({
      where: {
        type: "message",
        [Op.or]: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
      order: [["date_time", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Error retrieving messages", error: error.message });
  }
};

exports.getAllMessagesForUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Fetch all messages where the user is either the sender or the receiver
    const messages = await Chat.findAll({
      where: {
        type: "message",
        [Op.or]: [
          { sender_id: user_id },
          { receiver_id: user_id },
        ],
      },
      order: [["date_time", "ASC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "first_name", "last_name", "profile_picture"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "first_name", "last_name", "profile_picture"],
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Error retrieving messages", error: error.message });
  }
};
