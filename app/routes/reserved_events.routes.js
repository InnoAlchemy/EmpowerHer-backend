module.exports = (app) => {
const reservedEventsController = require("../controllers/reserved_events.controller");
var router = require("express").Router();
 // Get all event reservations
 router.get('/reserved_events', reservedEventsController.getAllReservedEvents);

 // Get all event reservations
 router.get('/recent-transactions', reservedEventsController.getRecentTransactions);
  
 // Reserve an event
 router.post('/reserved_events', reservedEventsController.reserveEvent);

 // Get a reserved event by ID
 router.get('/reserved_events/:id', reservedEventsController.getReservedEventById);

 // Cancel a reserved event
 router.delete('/reserved_events/:id', reservedEventsController.cancelReservedEvent);

 router.get('/tickets-sold-remaining-count-percentage', reservedEventsController.getTotalTicketsWithPercentage);

 app.use("/api", router);
};