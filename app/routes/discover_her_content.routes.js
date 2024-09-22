module.exports = (app) => {
    const discoverHerController = require("../controllers/discover_her_content.controller");
    const upload = require('../middleware/uploadMiddleware');
    var router = require("express").Router();
  
    // Get all active content
    router.get('/discover_her_content', discoverHerController.getAllContent);
  
    // Add new content
    router.post('/discover_her_content',upload.single('image'), discoverHerController.addContent);
  
    // Get content by ID
    router.get('/discover_her_content/:id', discoverHerController.getContentById);
  
    // Update content details
    router.put('/discover_her_content/:id',upload.single('image'), discoverHerController.updateContent);
  
    // Delete content by ID
    router.delete('/discover_her_content/:id', discoverHerController.deleteContent);
  
    app.use("/api", router);
  };
  