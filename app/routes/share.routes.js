// app/routes/share.routes.js
module.exports = (app) => {
const express = require('express');
const router = express.Router();
const shareController = require("../controllers/share.controller");


// Get all shares
router.get('/shares', shareController.getAllShares);

// Add a new share
router.post('/shares', shareController.addShare);

// Get a share by ID
router.get('/shares/:id', shareController.getShareById);

// Get shares by Post ID
router.get('/shares/by-post/:post_id', shareController.getSharesByPostId);

// Get shares by User ID
router.get('/shares/by-user/:user_id', shareController.getSharesByUserId);

// Delete a share by ID
router.delete('/shares/:id', shareController.deleteShare);


  app.use("/api", router);
};
