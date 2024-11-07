// app/routes/viewed.routes.js
module.exports = (app) => {
const express = require('express');
const router = express.Router();
const viewedController = require("../controllers/view.controller");

// Get all view records
router.get('/views', viewedController.getAllViews);

// Add a new view
router.post('/views', viewedController.addView);

// Get a view record by ID
router.get('/views/:id', viewedController.getViewById);

// Get views by Post ID
router.get('/views/by-post/:post_id', viewedController.getViewsByPostId);

// Get views by User ID
router.get('/views/by-user/:user_id', viewedController.getViewsByUserId);

// Delete a view record by ID
router.delete('/views/:id',viewedController.deleteView);

 // Get Likes Count By Post ID
 router.get('/views/views-count/:post_id', viewedController.getViewsCountByPostId);


  app.use("/api", router);
};
