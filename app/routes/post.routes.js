module.exports = (app) => {
    const postController = require("../controllers/post.controller");
    const upload = require('../middleware/uploadMiddleware'); 
    var router = require("express").Router();
  
    // Get all posts
    router.get('/posts', postController.getAllPosts);
  
    // Add a new post
    router.post('/posts',upload.single('media_url'), postController.addPost);
  
    // Get a posts by ID
    router.get('/posts/:id', postController.getPostById);

    // Get a posts by User ID
     router.get('/posts/by-user-id/:user_id', postController.getPostsByUserId);
  
    // Update a page by ID
    router.put('/posts/:id',upload.single('media_url'), postController.updatePost);
  
    // Delete a page by ID
    router.delete('/posts/:id', postController.deletePost);
  
    app.use("/api", router);
  };
  