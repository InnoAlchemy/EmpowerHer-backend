// app/routes/comment.routes.js

module.exports = (app) => {
    const commentController = require("../controllers/comment.controller");
    const router = require("express").Router();
  
    // Get all comments
    router.get('/comments', commentController.getAllComments);
  
    // Add a new comment
    router.post('/comments', commentController.addComment);
  
    // Get a comment by ID
    router.get('/comments/:id', commentController.getCommentById);
  
    // Get comments by Post ID
    router.get('/comments/by-post/:post_id', commentController.getCommentsByPostId);
  
    // Get comments by User ID
    router.get('/comments/by-user/:user_id', commentController.getCommentsByUserId);
  
    // Update a comment by ID
    router.put('/comments/:id', commentController.updateComment);
  
    // Delete a comment by ID
    router.delete('/comments/:id', commentController.deleteComment);
  
    app.use("/api", router);
  };
  