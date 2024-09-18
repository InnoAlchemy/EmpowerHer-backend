module.exports = (app) => {
    const partnershipTypesController = require("../controllers/partnership_types.controller");
  
    var router = require("express").Router();
  
    // Get all partnership types
    router.get('/partnership_types', partnershipTypesController.getAllPartnershipTypes);
  
    // Create a new partnership type
    router.post('/partnership_types', partnershipTypesController.addPartnershipType);
  
    // Get a partnership type by ID
    router.get('/partnership_types/:id', partnershipTypesController.getPartnershipTypeById);
  
    // Delete a partnership type by ID
    router.delete('/partnership_types/:id', partnershipTypesController.deletePartnershipType);
  
    app.use("/api", router);
  };
  