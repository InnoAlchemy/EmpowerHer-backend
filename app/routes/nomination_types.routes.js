module.exports = (app) => {
    const nominationTypesController = require("../controllers/nomination_types.controller");
  
    var router = require("express").Router();
  
    // Get all nomination types
    router.get('/nomination_types', nominationTypesController.getAllNominationTypes);
  
    // Create a new nomination type
    router.post('/nomination_types', nominationTypesController.addNominationType);
  
    // Get a nomination type by ID
    router.get('/nomination_types/:id', nominationTypesController.getNominationTypeById);
  
    // Delete a nomination type by ID
    router.delete('/nomination_types/:id', nominationTypesController.deleteNominationType);
  
    app.use("/api", router);
  };
  