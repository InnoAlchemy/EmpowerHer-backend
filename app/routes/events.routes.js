module.exports = (app) => {
    const eventsController = require("../controllers/events.controller");
    const upload = require('../middleware/uploadMiddleware');
    const authenticateJWT = require('../middleware/Jwt_middleware'); 
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
    router.put('/events/accept/:id',authenticateJWT, Admin, eventsController.acceptEvent);
  
    // Delete an event by ID
    router.delete('/events/:id', eventsController.deleteEvent);
  
   // Get All pending Events
   router.get('/pending-events', eventsController.getPendingEvents);
  
    app.use("/api", router);
  };
  