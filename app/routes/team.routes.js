module.exports = (app) => {
    const teamController = require("../controllers/team.controller");
    const upload = require('../middleware/uploadMiddleware'); 
    var router = require("express").Router();
  
    // Get all active team members
    router.get('/team', teamController.getAllTeamMembers);
  
    // Add a new team member
    router.post('/team',upload.single('image'), teamController.addTeamMember);
  
    // Get team member by ID
    router.get('/team/:id', teamController.getTeamMemberById);
  
    // Update team member details
    router.put('/team/:id',upload.single('image'), teamController.updateTeamMember);
  
    // Delete team member by ID
    router.delete('/team/:id', teamController.deleteTeamMember);
  
    app.use("/api", router);
  };
  