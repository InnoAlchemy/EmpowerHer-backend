module.exports = (app) => {
    const eventsController = require("../controllers/events.controller");
    
  
    var router = require("express").Router();
  
    // Get all events
    router.get('/events', eventsController.getAllEvents);
  
    // Add a new event
    router.post('/events', eventsController.addEvent);
  
    // Get an event by ID
    router.get('/events/:id', eventsController.getEventById);
  
    // Update event details
    router.put('/events/:id', eventsController.updateEvent);
  
    // Delete an event by ID
    router.delete('/events/:id', eventsController.deleteEvent);
  
   
  
    app.use("/api", router);
  };
  