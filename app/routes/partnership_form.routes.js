module.exports = (app) => {
    const PatrnershipformsController = require("../controllers/partnership_form.controller");
    const partnershipfileupload = require("../middleware/partnership_form_upload.Middleware");
    var router = require("express").Router();
  
    // Get all Partnership forms
    router.get('/partnership_forms', PatrnershipformsController.getAllForms);
  
    // Submit a new Partnership form
    router.post('/partnership_forms',partnershipfileupload, PatrnershipformsController.submitForm);
  
    // Get a Partnership form by ID
    router.get('/partnership_forms/:id', PatrnershipformsController.getFormById);
  
    // Delete a Partnership form by ID
    router.delete('/partnership_forms/:id', PatrnershipformsController.deleteForm);
  
    app.use("/api", router);
  };
  