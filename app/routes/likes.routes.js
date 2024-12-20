// app/routes/like.routes.js

module.exports = (app) => {
    const likeController = require("../controllers/likes.controller");
    const router = require("express").Router();
  
    // Get all likes
    router.get('/likes', likeController.getAllLikes);
  
    // Add a new like
    router.post('/likes', likeController.addLike);
  
    // Remove a like
    router.delete('/likes', likeController.removeLike);
  
    // Get likes by post ID
    router.get('/likes/by-post/:post_id', likeController.getLikesByPostId);
  
    // Get likes by user ID
    router.get('/likes/by-user/:user_id', likeController.getLikesByUserId);

    // Get Likes Count By Post ID
    router.get('/likes/likes-count/:post_id', likeController.getLikesCountByPostId);
  
    app.use("/api", router);
  };
  