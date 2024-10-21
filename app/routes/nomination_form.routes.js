module.exports = (app) => {
    const NominationformsController = require("../controllers/nomination_form.controller");
    const nominationfileupload = require("../middleware/nomination_form_upload.Middleware");
    var router = require("express").Router();
  
    // Get all Nomination forms
    router.get('/nomination_forms', NominationformsController.getAllForms);
  
    // Submit a new Nomination form
    router.post('/nomination_forms',nominationfileupload, NominationformsController.submitForm);
  
    // Get a Nomination form by ID
    router.get('/nomination_forms/:id', NominationformsController.getFormById);
  
    // Delete a Nomination form by ID
    router.delete('/nomination_forms/:id', NominationformsController.deleteForm);
  
    app.use("/api", router);
  };
  