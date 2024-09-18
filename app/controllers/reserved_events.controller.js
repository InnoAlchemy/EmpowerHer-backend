const db = require("../models");
const ReservedEvent = db.reserved_events;

// Get all event reservations
exports.getAllReservedEvents = async (req, res) => {
  try {
    const reservedEvents = await ReservedEvent.findAll();
    res.status(200).json(reservedEvents);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reserved events" });
  }
};

// Reserve an event
exports.reserveEvent = async (req, res) => {
  const {  user_id, event_id, coupon_used_id, payment_data, total_price } = req.body;
  try {
    const newReservation = await ReservedEvent.create({
      
      user_id,
      event_id,
      coupon_used_id,
      payment_data,
      total_price
    });
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get a reserved event by ID
exports.getReservedEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const reservedEvent = await ReservedEvent.findOne({ where: { id } });
    if (!reservedEvent) {
      return res.status(404).json({ message: "Reserved event not found" });
    }
    res.status(200).json(reservedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reserved event" });
  }
};

// Cancel a reserved event
exports.cancelReservedEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const reservedEvent = await ReservedEvent.findOne({ where: { id } });
    if (!reservedEvent) {
      return res.status(404).json({ message: "Reserved event not found" });
    }
    await reservedEvent.destroy();
    res.status(200).json({ message: "Reserved event cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling reserved event" });
  }
};
