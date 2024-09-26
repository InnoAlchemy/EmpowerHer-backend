module.exports = (app) => {
const ticketsController = require("../controllers/tickets.controller");

const router = require("express").Router();
// Get All Tickets
router.get("/tickets", ticketsController.getAllTickets);

// Create Tickets
router.post("/tickets", ticketsController.createTicket);

// Get Ticket By Id
router.get("/tickets/:id", ticketsController.getTicketById);

// Update Tickets
router.put("/tickets/:id", ticketsController.updateTicketUsage);

// Delete Ticket
router.delete("/tickets/:id", ticketsController.deleteTicket);

app.use("/api", router);
};