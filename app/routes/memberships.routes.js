module.exports = (app) => {
    const membershipController = require("../controllers/membership.controller");
  
    var router = require("express").Router();
  
    // Get all memberships
    router.get('/memberships', membershipController.getAllMemberships);
  
    // Add a new membership
    router.post('/memberships', membershipController.addMembership);
  
    // Get membership by ID
    router.get('/memberships/:id', membershipController.getMembershipById);
  
    // Update a membership by ID
    router.put('/memberships/:id', membershipController.updateMembership);
  
    // Delete a membership by ID
    router.delete('/memberships/:id', membershipController.deleteMembership);

     // Get total of memberships and percentage for each type
     router.get('/memberships-stats', membershipController.getMembershipStats);
  
    app.use("/api", router);
  };
  