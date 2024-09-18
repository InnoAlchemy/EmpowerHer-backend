module.exports = (app) => {
    const userToolsController = require("../controllers/user_tools.controller");
  
    var router = require("express").Router();
  
    // Get all user tools
    router.get('/user_tools', userToolsController.getAllUserTools);
  
    // Link a tool to a user
    router.post('/user_tools', userToolsController.addUserTool);
  
    // Get a specific user-tool relation by ID
    router.get('/user_tools/:id', userToolsController.getUserToolById);
  
    // Remove a tool from a user by ID
    router.delete('/user_tools/:id', userToolsController.deleteUserTool);
  
    app.use("/api", router);
  };
  