const db = require("../models");
const Event = db.events;
const ReservedEvent= db.reserved_events;
const User=db.users;
const Op = db.Sequelize.Op;
const Ticket = db.tickets; // Assuming your Sequelize models are setup properly
const QRCode = require('qrcode'); // QR code generation library

const formatTimeTo12Hour = require('../Helper-Functions/formatTime-12hours');
const calculateComparisonPercentage = require('../Helper-Functions/helper_functions');
 // Allowed enum values for validation
 const allowedTypes = ["online", "on-site", "both"];
 const allowedCategories = ["event", "workshop"];


// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{
        model: User, 
       
      }]
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events" });
  }
};

// Add a new event
exports.addEvent = async (req, res) => {
  const {
    user_id, title, description, date, start_time, end_time, location, type, category, price, status, ticket_amount
  } = req.body;

  // Validate user_id
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

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

  const image = process.env.NODE_ENV === 'production'
    ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
    : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;

  try {
    // Convert start_time and end_time to 12-hour format
    const formattedStartTime = formatTimeTo12Hour(start_time);
    const formattedEndTime = formatTimeTo12Hour(end_time);

    // Create the event
    const newEvent = await Event.create({
      user_id,
      image,
      title,
      description,
      date,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      location,
      type,
      category,
      status,
      price,
    });

    // Create tickets for the event if ticket_amount is provided
    if (ticket_amount && ticket_amount > 0) {
      const ticketsToCreate = [];

      for (let i = 0; i < ticket_amount; i++) {
        // Generate a unique QR code for each ticket
        const qrCode = await QRCode.toDataURL(`ticket-${newEvent.id}-${Date.now()}-${i}`);

        ticketsToCreate.push({
          event_id: newEvent.id,
          qrcode: qrCode,
          amount: 1 // Assuming each ticket has an amount of 1
        });
      }

      // Create all tickets in bulk
      await Ticket.bulkCreate(ticketsToCreate);
    }

    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(400).json({ message: "Error creating event or tickets", error: error.message });
  }
};
/*exports.addEvent = async (req, res) => {
  const { user_id, title, description, date, start_time, end_time, location, type, category, price, status, Languages } = req.body;

  // Validate user_id
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Validate type
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid type value" });
  }

  // Validate category
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category value" });
  }

  // Validate languages
  const allowedLanguages = ["english", "french", "arabic"];
  if (!allowedLanguages.includes(Languages)) {
    return res.status(400).json({ message: "Invalid language value" });
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
     // Convert start_time and end_time to 12-hour format
     const formattedStartTime = formatTimeTo12Hour(start_time);
     const formattedEndTime = formatTimeTo12Hour(end_time);
 
    const newEvent = await Event.create({
      user_id,
      image,
      title,
      description,
      date,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      location,
      type,
      category,
      status,
      Languages,
      price,
      is_accepted: false 
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};
*/

// Get event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ where: { id }, include: [{
      model: User, 
     
    }] });
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
  const {
    user_id, title, description, date, start_time, end_time, location, type, category, price, status,Languages, is_accepted
  } = req.body;

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

    // Convert start_time and end_time to 12-hour format if provided
    const formattedStartTime = start_time ? formatTimeTo12Hour(start_time) : event.start_time;
    const formattedEndTime = end_time ? formatTimeTo12Hour(end_time) : event.end_time;

    if (req.file) {
      event.image = process.env.NODE_ENV === 'production'
        ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
        : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;
    }

    event.user_id = user_id !== undefined ? user_id : event.user_id;
    event.title = title !== undefined ? title : event.title;
    event.description = description !== undefined ? description : event.description;
    event.date = date !== undefined ? date : event.date;
    event.start_time = formattedStartTime;
    event.end_time = formattedEndTime;
    event.location = location !== undefined ? location : event.location;
    event.type = type !== undefined ? type : event.type;
    event.category = category !== undefined ? category : event.category;
    event.price = price !== undefined ? price : event.price;
    event.status = status !== undefined ? status : event.status;
    event.Languages = Languages!== undefined? Languages : event.Languages;
    event.is_accepted = is_accepted !== undefined ? is_accepted : event.is_accepted;

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
      attributes: ['title', 'date', 'start_time'], // Fetch event-specific fields
      include: [{
        model: User,
        attributes: ['first_name', 'last_name'] // Fetch user's first and last names
      }]
    });

    const totalPending = pendingEvents.length;

    // Format response data
    const response = {
      total: totalPending,
      events: pendingEvents.map(event => {
        const requestedBy = event.user ? `${event.user.first_name} ${event.user.last_name}` : 'Unknown User';
        return {
          name: event.title,
          date_time: `${event.date} ${event.start_time}`,  // Combine date and time
          requested_by: requestedBy  // Full name of the user
        };
      }),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pending events", error: error.message });
  }
};

// Get monthly event statistics(recent events)

exports.getMonthlyEventStats = async (req, res) => {
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  const currentMonthEnd = new Date();
  currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
  currentMonthEnd.setDate(1);

  const lastMonthStart = new Date(currentMonthStart);
  lastMonthStart.setMonth(currentMonthStart.getMonth() - 1);
  lastMonthStart.setDate(1);
  const lastMonthEnd = new Date(currentMonthStart);

  try {
    // Get total events for the current month
    const currentMonthEvents = await Event.findAll({
      where: {
        date: {
          [Op.gte]: currentMonthStart,
          [Op.lt]: currentMonthEnd,
        },
      },
    });

    const totalCurrentMonth = currentMonthEvents.length;

    // Get total events for the last month
    const lastMonthEvents = await Event.findAll({
      where: {
        date: {
          [Op.gte]: lastMonthStart,
          [Op.lt]: lastMonthEnd,
        },
      },
    });

    const totalLastMonth = lastMonthEvents.length;

    // Prepare comparison message
    let comparisonMessage = "";
    const difference = totalCurrentMonth - totalLastMonth;
    if (difference > 0) {
      comparisonMessage = `${difference} more`;
    } else if (difference < 0) {
      comparisonMessage = `${Math.abs(difference)} less`;
    } else {
      comparisonMessage = "no change";
    }

    // Prepare detailed event data
    const eventsDetails = await Promise.all(currentMonthEvents.map(async (event) => {
      // Fetch reserved events for the current event
      const reservedCount = await ReservedEvent.count({
        where: { event_id: event.id }
      });

      // Total tickets sold
      const totalTicketsSold = await ReservedEvent.sum('ticket_quantity', {
        where: { event_id: event.id }
      }) || 0;

      // Total revenue generated from reserved events
      const totalRevenue = await ReservedEvent.sum('total_price', {
        where: { event_id: event.id }
      }) || 0;

      return {
        title: event.title,
        date_and_time: `${event.date} ${formatTimeTo12Hour(event.start_time)}`, // Format time here
        location: event.location,
        number_of_registrations: reservedCount,
        total_tickets_sold: totalTicketsSold,
        revenue_generated: `$${totalRevenue.toFixed(2)}`,
        deatils:event.description
      };
    }));

    // Respond with the results
    res.status(200).json({
      total: totalCurrentMonth,
      comparison: comparisonMessage,
      events: eventsDetails,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error retrieving monthly event statistics" });
  }
};

// Get total revenue and compare with last month
exports.getTotalRevenue = async (req, res) => {
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1); // First day of current month

  const currentMonthEnd = new Date(currentMonthStart);
  currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1); // First day of next month

  const lastMonthStart = new Date(currentMonthStart);
  lastMonthStart.setMonth(currentMonthStart.getMonth() - 1); // First day of last month
  const lastMonthEnd = new Date(currentMonthStart); // First day of current month (end of last month)

  try {
    // Calculate total revenue for the current month
    const currentMonthRevenue = await ReservedEvent.sum('total_price', {
      where: {
        createdAt: {
          [Op.gte]: currentMonthStart,
          [Op.lt]: currentMonthEnd,
        },
      },
    }) || 0;

    // Calculate total revenue for the previous month
    const lastMonthRevenue = await ReservedEvent.sum('total_price', {
      where: {
        createdAt: {
          [Op.gte]: lastMonthStart,
          [Op.lt]: lastMonthEnd,
        },
      },
    }) || 0;

    // Calculate the comparison percentage using the helper function
    const percentageChange = await calculateComparisonPercentage(currentMonthRevenue, lastMonthRevenue);

    // Respond with total revenue and comparison percentage
    res.status(200).json({
      total_revenue: `$${currentMonthRevenue.toFixed(2)}`,
      comparison: percentageChange
    });

  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error calculating total revenue", error: error.message });
  }
};