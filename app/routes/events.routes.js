module.exports = (app) => {
    const eventsController = require("../controllers/events.controller");
    const upload = require('../middleware/uploadMiddleware');
    const authenticateJWT = require('../middleware/Jwt_middleware'); 
    const Admin= require('../middleware/Admin_middleware');
    const hasPermission = require('../middleware/Role_Permissions_middleware');
    var router = require("express").Router();
  
    // Get all events
    router.get('/events',authenticateJWT ,hasPermission('read_event'), eventsController.getAllEvents);
  
    // Add a new event
    router.post('/events',upload.single('image'),authenticateJWT ,hasPermission('create_event'), eventsController.addEvent);
  
    // Get an event by ID
    router.get('/events/:id',authenticateJWT ,hasPermission('read_event'), eventsController.getEventById);
  
    // Update event details
    router.put('/events/:id',upload.single('image'),authenticateJWT ,hasPermission('update_event'), eventsController.updateEvent);

    // Accept/Reject event by Admin
    router.put('/events/accept/:id',authenticateJWT, Admin, eventsController.acceptEvent);
  
    // Delete an event by ID
    router.delete('/events/:id',authenticateJWT ,hasPermission('delete_event'), eventsController.deleteEvent);
  
    // Get All pending Events
    router.get('/pending-events',authenticateJWT ,hasPermission('read_event'), eventsController.getPendingEvents);

    // Get All pending Events
    router.get('/recent-events',authenticateJWT ,hasPermission('read_event'), eventsController.getMonthlyEventStats);

    // Get Total Revenue
    router.get('/total-revenue',authenticateJWT ,hasPermission('read_event'), eventsController.getTotalRevenue);
  
    app.use("/api", router);
  };
  