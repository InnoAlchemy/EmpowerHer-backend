// routes/notificationRoutes.js
module.exports = (app) => {
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// Route to create a new notification
router.post("/notifications", notificationController.createNotification);

// Route to get all notifications for a specific user
router.get("/notifications/user/:user_id", notificationController.getUserNotifications);

// Route to get a single notification by ID
router.get("/notifications/:id", notificationController.getNotificationById);

// Route to update a notification by ID
router.put("/notifications/:id", notificationController.updateNotification);

// Route to delete a notification by ID
router.delete("/notifications/:id", notificationController.deleteNotification);

app.use("/api", router);
};
