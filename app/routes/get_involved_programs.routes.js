module.exports = (app) => {
    const getInvolvedController = require("../controllers/get_involved_programs.controller");
    const upload = require('../middleware/uploadMiddleware');
    var router = require("express").Router();
  
    // Get all active programs
    router.get('/get_involved_programs', getInvolvedController.getAllPrograms);
  
    // Add a new program
    router.post('/get_involved_programs',upload.single('icon'), getInvolvedController.addProgram);
  
    // Get program by ID
    router.get('/get_involved_programs/:id', getInvolvedController.getProgramById);
  
    // Update program details
    router.put('/get_involved_programs/:id',upload.single('icon'), getInvolvedController.updateProgram);
  
    // Delete program by ID
    router.delete('/get_involved_programs/:id', getInvolvedController.deleteProgram);
  
    app.use("/api", router);
  };
  