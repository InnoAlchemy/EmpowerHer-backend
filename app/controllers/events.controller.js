const db = require("../models");
const Event = db.events;
  // Allowed enum values for validation
  const allowedTypes = ["online", "on-site", "both"];
  const allowedCategories = ["event", "workshop"];
// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events" });
  }
};

// Add a new event
exports.addEvent = async (req, res) => {
  const { image, title, description, date, time, location, type, category, price } = req.body;

  // Validate type
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid type value" });
  }

  // Validate category
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category value" });
  }

  try {
    const newEvent = await Event.create({
      image,
      title,
      description,
      date,
      time,
      location,
      type,
      category,
      price,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving event" });
  }
};

// Update event details
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { image, title, description, date, time, location, type, category, price } = req.body;

  try {
    // Find the event
    const event = await Event.findOne({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Validate type if provided
    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type value" });
    }

    // Validate category if provided
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category value" });
    }

    // Update only provided fields
    event.image = image !== undefined ? image : event.image;
    event.title = title !== undefined ? title : event.title;
    event.description = description !== undefined ? description : event.description;
    event.date = date !== undefined ? date : event.date;
    event.time = time !== undefined ? time : event.time;
    event.location = location !== undefined ? location : event.location;
    event.type = type !== undefined ? type : event.type;
    event.category = category !== undefined ? category : event.category;
    event.price = price !== undefined ? price : event.price;

    // Save updated event
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};


// Delete an event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
};
