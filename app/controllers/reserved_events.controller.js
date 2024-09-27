const db = require("../models");
const ReservedEvent = db.reserved_events;
const Ticket = db.tickets;
const Event = db.events;
const Coupon=db.coupons;
const moment = require("moment"); 
const { Op } = require("sequelize");
const formatTimeTo12Hour = require("../Helper-Functions/formatTime-12hours");
const calculateComparisonPercentage = require("../Helper-Functions/helper_functions");

// Get all event reservations
exports.getAllReservedEvents = async (req, res) => {
  try {
    const reservedEvents = await ReservedEvent.findAll();
    res.status(200).json(reservedEvents);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error retrieving reserved events" });
  }
};


// Reserve an event
exports.reserveEvent = async (req, res) => {
  const { user_id, event_id, ticket_id, coupon_used_id, payment_data, ticket_quantity } = req.body;

  // Validate required fields
  if (!user_id || !event_id || !ticket_id || !payment_data || !ticket_quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Fetch event details to calculate the total price
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Calculate the total price
    const total_price_before_discount = event.price * ticket_quantity; // Assuming event model has a 'price' field

    // Initialize discount variables
    let discountAmount = 0;

    // Check if a coupon is used
    if (coupon_used_id) {
      const coupon = await Coupon.findByPk(coupon_used_id);
      if (coupon) {
        // Calculate the discount
        discountAmount = (total_price_before_discount * coupon.code) / 100; // Assuming coupon.code contains the discount percentage
      } else {
        return res.status(404).json({ message: "Coupon not found" });
      }
    }

    // Calculate the final total price after applying the discount
    const total_price_after_discount = total_price_before_discount - discountAmount;

    // Create a new reservation
    const newReservation = await ReservedEvent.create({
      user_id,
      event_id,
      ticket_id,
      coupon_used_id,
      payment_data,
      ticket_quantity,
      total_price: total_price_after_discount, // Store the final price
    });

    // Return both total prices in the response
    res.status(201).json({
      newReservation,
      total_price_before_discount,
      total_price_after_discount,
      discountAmount,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
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
    console.error(error); // Log error for debugging
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
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error cancelling reserved event" });
  }
};

// Recent Transactions Controller Method
exports.getRecentTransactions = async (req, res) => {
  try {
      // Get the first and last date of the current month
      const startOfMonth = moment().startOf('month').toDate();
      const endOfMonth = moment().endOf('month').toDate();

      // Query the ReservedEvent model to get transactions for the current month
      const transactions = await db.reserved_events.findAll({
          where: {
              createdAt: {
                  [Op.between]: [startOfMonth, endOfMonth]
              }
          },
          include: [
              {
                  model: db.users,
                  attributes: ['first_name', 'last_name'],
                  include: [
                      {
                          model: db.role,
                          attributes: ['name']
                      }
                  ]
              }
          ],
          attributes: ['total_price', 'createdAt'],
      });

      const totalCount = transactions.length; // Total reserved event count for this month

      // Get the percentage comparison between this month and last month
      const comparisonText = await calculateComparisonPercentage();

      // Format the transaction details
      const transactionDetails = transactions.map(transaction => {
          const formattedDateTime = moment(transaction.createdAt).format('MM/DD/YYYY') + ' ' + formatTimeTo12Hour(transaction.createdAt.toTimeString().split(' ')[0]);

          return {
              name: `${transaction.user.first_name} ${transaction.user.last_name}`, // Full name of the user
              amount: transaction.total_price, // Total price for the reserved event
              type: transaction.user.role.name, // User role
              dateTime: formattedDateTime // Formatted date and time
          };
      });

      // Create the final response structure
      const response = {
          total: totalCount, // Total transactions for the month
          comparison: comparisonText, // Percentage comparison with last month
          transactions: transactionDetails // List of individual transactions
      };

      // Return the formatted response
      return res.status(200).json(response);
  } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "An error occurred while fetching transactions." });
  }
};

// Get total tickets sold, total tickets remaining, and their percentages
exports.getTotalTicketsWithPercentage = async (req, res) => {
  try {
    // Calculate total tickets sold (sum of ticket_quantity from reserved events)
    const totalTicketsSold = await ReservedEvent.sum('ticket_quantity') || 0;

    // Calculate total tickets available (sum of 'amount' from the Ticket model)
    const totalTicketsAvailable = await Ticket.sum('amount') || 0;

    // Calculate total tickets remaining
    const totalTicketsRemaining = totalTicketsAvailable - totalTicketsSold;

    // Avoid division by zero by checking if there are available tickets
    let percentageSold = 0;
    let percentageRemaining = 0;

    if (totalTicketsAvailable > 0) {
      // Calculate the percentage of tickets sold
      percentageSold = ((totalTicketsSold / totalTicketsAvailable) * 100).toFixed(2);

      // Calculate the percentage of tickets remaining
      percentageRemaining = ((totalTicketsRemaining / totalTicketsAvailable) * 100).toFixed(2);
    }

    // Return the total tickets sold, remaining, and their percentages
    res.status(200).json({
      total_tickets_sold: totalTicketsSold,
      total_tickets_remaining: totalTicketsRemaining,
      percentage_sold: `${percentageSold}%`,
      percentage_remaining: `${percentageRemaining}%`
    });
  } catch (error) {
    console.error("Error fetching ticket data:", error); // Log error for debugging
    res.status(500).json({ message: "An error occurred while fetching ticket data." });
  }
};