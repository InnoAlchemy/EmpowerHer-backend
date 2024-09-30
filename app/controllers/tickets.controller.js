const db = require("../models");
const Ticket = db.tickets;
const Event = db.events;
const QRCode = require('qrcode');  // Import QR code generation library
const { v4: uuidv4 } = require('uuid');
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
/*exports.createTicket = async (req, res) => {
  const { event_id, amount } = req.body;

  try {
    // Check if the event exists
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Generate a unique short identifier for the ticket
    const ticketIdentifier = `ticket-${event_id}-${uuidv4()}`;

    // Create the ticket and associate it with the event
    const newTicket = await Ticket.create({
      event_id,
      qrcode: ticketIdentifier,  // Save the unique short identifier
      amount: amount || 1,
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(400).json({ message: "Error creating ticket" });
  }
};*/
// Create multiple tickets for an event
exports.createTicket = async (req, res) => {
  const { event_id, amount } = req.body;  // 'amount' specifies the number of tickets

  try {
    // Check if the event exists
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Array to hold all created tickets
    const tickets = [];

    // Loop through the specified amount to create multiple tickets
    for (let i = 0; i < amount; i++) {
      // Generate a unique short identifier for each ticket
      const ticketIdentifier = `ticket-${event_id}-${uuidv4()}`;

      // Create the ticket and associate it with the event
      const newTicket = await Ticket.create({
        event_id,
        qrcode: ticketIdentifier,  // Save the unique short identifier
        amount: 1,                 // Each ticket has an individual amount of 1
      });

      // Add each created ticket to the tickets array
      tickets.push(newTicket);
    }

    // Return all the created tickets as the response
    res.status(201).json(tickets);
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(400).json({ message: "Error creating tickets" });
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

    // Generate the QR code from the short identifier
    const qrCode = await QRCode.toDataURL(ticket.qrcode);

    // Send the QR code back with the ticket details
    res.status(200).json({ ...ticket.toJSON(), qrCode });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving ticket" });
  }
};

// Update ticket usage status (mark as used)
exports.updateTicketUsage = async (req, res) => {
  const { id } = req.params;
  const { is_used ,amount} = req.body;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.is_used = is_used;
    ticket.amount = amount;
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
