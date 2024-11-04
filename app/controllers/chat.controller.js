// controllers/chatController.js

const db = require("../models");
const Chat = db.chats;
const User = db.users;
const { Op, fn, col, where, literal } = db.Sequelize;

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

    // Emit real-time event to the receiver about the new connection request
    const io = req.app.locals.io;
    io.to(`user_${receiver_id}`).emit("newConnectionRequest", {
      from: senderInfo,
      request: newRequest,
    });

    res.status(201).json({
      message: "Connection request sent.",
      request: newRequest,
      sender: senderInfo,
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

    // Update the connection status based on action
    if (action === "accept") {
      request.status = "accepted";
      request.is_connected = true;
      await request.save();

      // Emit real-time event to the sender about the acceptance
      const io = req.app.locals.io;
      io.to(`user_${sender_id}`).emit("connectionAccepted", {
        by: receiver_id,
        request,
      });

      return res.status(200).json({ message: "Connection request accepted.", request });
    } else if (action === "reject") {
      request.status = "rejected";
      request.is_connected = false;
      await request.save();

      // Emit real-time event to the sender about the rejection
      const io = req.app.locals.io;
      io.to(`user_${sender_id}`).emit("connectionRejected", {
        by: receiver_id,
        request,
      });

      return res.status(200).json({ message: "Connection request rejected.", request });
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

    const newMessage = await Chat.create({
      type: "message",
      is_connected: true,
      content,
      sender_id,
      receiver_id,
      date_time: new Date(),
    });

    // Emit real-time event to the receiver about the new message
    const io = req.app.locals.io;
    io.to(`user_${receiver_id}`).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
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
