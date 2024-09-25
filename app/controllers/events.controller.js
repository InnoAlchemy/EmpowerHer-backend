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
  const { title, description, date, time, location, type, category, price } = req.body;

  // Validate type
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid type value" });
  }

  // Validate category
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category value" });
  }

  // Check for required image file
  if (!req.file) {
    return res.status(400).json({ message: "Image is required." });
  }

  // Construct the image URL based on the environment
  const image = process.env.NODE_ENV === 'production' 
    ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
    : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;

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
  const { title, description, date, time, location, type, category, price,is_accepted } = req.body;

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
    if (req.file) {
      event.image = process.env.NODE_ENV === 'production' 
        ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
        : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;
    }
    event.title = title !== undefined ? title : event.title;
    event.description = description !== undefined ? description : event.description;
    event.date = date !== undefined ? date : event.date;
    event.time = time !== undefined ? time : event.time;
    event.location = location !== undefined ? location : event.location;
    event.type = type !== undefined ? type : event.type;
    event.category = category !== undefined ? category : event.category;
    event.price = price !== undefined ? price : event.price;
    event.is_accepted = is_accepted !== undefined ? is_accepted : event.is_accepted;
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

// Accept event by Admin
exports.acceptEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_accepted } = req.body; // true to accept, false to reject

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    event.is_accepted = is_accepted;
    await event.save();

    const message = is_accepted ? 'Event accepted successfully!' : 'Event denied successfully!';
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event status', error: error.message });
  }
};

// Get total number of pending events
exports.getPendingEvents = async (req, res) => {
  try {
    const pendingEvents = await Event.findAll({
      where: { is_accepted: false },
      attributes: ['title', 'date', 'time'], 
    });

    const totalPending = pendingEvents.length;

    // Format response data
    const response = {
      total: totalPending,
      events: pendingEvents.map(event => ({
        name: event.title,
        date_time: `${event.date} ${event.time}`, // Combine date and time
        requested_by: 'user',
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pending events", error: error.message });
  }
};
