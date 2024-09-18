module.exports = (app) => {
    const formsController = require("../controllers/forms.controller");
  
    var router = require("express").Router();
  
    // Get all forms
    router.get('/forms', formsController.getAllForms);
  
    // Submit a new form
    router.post('/forms', formsController.submitForm);
  
    // Get a form by ID
    router.get('/forms/:id', formsController.getFormById);
  
    // Delete a form by ID
    router.delete('/forms/:id', formsController.deleteForm);
  
    app.use("/api", router);
  };
  