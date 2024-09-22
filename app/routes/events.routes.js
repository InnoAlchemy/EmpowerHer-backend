module.exports = (app) => {
    const eventsController = require("../controllers/events.controller");
    const upload = require('../middleware/uploadMiddleware');
    const Admin = require('../middleware/Admin_middleware');
    var router = require("express").Router();
  
    // Get all events
    router.get('/events', eventsController.getAllEvents);
  
    // Add a new event
    router.post('/events',upload.single('image'), eventsController.addEvent);
  
    // Get an event by ID
    router.get('/events/:id', eventsController.getEventById);
  
    // Update event details
    router.put('/events/:id',upload.single('image'), eventsController.updateEvent);

    // Accept/Reject event by Admin
    router.put('/events/:id/accept',  Admin, eventsController.acceptEvent);
  
    // Delete an event by ID
    router.delete('/events/:id', eventsController.deleteEvent);
  
   
  
    app.use("/api", router);
  };
  