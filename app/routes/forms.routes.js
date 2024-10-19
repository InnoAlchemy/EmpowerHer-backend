
module.exports = (app) => {
    const formsController = require("../controllers/forms.controller");
    const textupload = require("../middleware/textUploadMiddleware");
    var router = require("express").Router();
  
    // Get all forms
    router.get('/forms', formsController.getAllForms);
  
    // Submit a new form
    router.post('/forms',textupload, formsController.submitForm);
  
    // Get a form by ID
    router.get('/forms/:id', formsController.getFormById);
  
    // Delete a form by ID
    router.delete('/forms/:id', formsController.deleteForm);
  
    app.use("/api", router);
  };
  