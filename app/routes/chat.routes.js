// routes/chatRoutes.js
module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const chatController = require("../controllers/chat.controller");

  // Route to send a message between users
  router.post("/chat/send", chatController.sendMessage);

  // Route to send a connection request
  router.post("/chat/connect/request", chatController.sendConnectionRequest);

  // Route for the receiver to accept or reject the connection request
  router.post(
    "/chat/connect/respond",
    chatController.respondToConnectionRequest
  );
  

  // Route to get all messages between two users
  router.get(
    "/chat/messages/:sender_id/:receiver_id",
    chatController.sendMessage
  );

   // Route to get all messages for user from all senders
   router.get(
    "/chat/all-messages/:user_id", chatController.getAllMessagesForUser
  );

 // Route to check connection status between two users
router.post("/chat/status", chatController.getConnectionStatus);

  // Route to search users and check connection status
  // router.get("/chat/search", chatController.searchUserAndConnectionStatus);

  app.use("/api", router);
};
