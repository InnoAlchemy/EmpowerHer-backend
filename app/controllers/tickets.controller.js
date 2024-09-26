const db = require("../models");
const Ticket = db.tickets;
const Event = db.events;

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [{ model: Event }]
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tickets" });
  }
};

// Create a ticket for an event
exports.createTicket = async (req, res) => {
  const { event_id, tickets_availability } = req.body;

  try {
    // Check if the event exists
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Create the ticket
    const newTicket = await Ticket.create({
      event_id,
      tickets_availability,
    });

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ message: "Error creating ticket" });
  }
};

// Get a ticket by ID
exports.getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id, { include: [{ model: Event }] });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving ticket" });
  }
};

// Update ticket usage status (mark as used)
exports.updateTicketUsage = async (req, res) => {
  const { id } = req.params;
  const { is_used } = req.body;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.is_used = is_used;
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ message: "Error updating ticket usage" });
  }
};

// Delete a ticket
exports.deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.destroy();
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ticket" });
  }
};
