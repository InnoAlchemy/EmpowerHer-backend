const db = require("../models");
const Membership = db.memberships;
// Valid enum values for membership type
const validTypes = ["individual", "corporate", "basic"];
// Get all memberships
exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll();
    res.status(200).json(memberships);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving memberships" });
  }
};

// Add a new membership
exports.addMembership = async (req, res) => {
  const { title, description, type, price, start_date, expiry_date } = req.body;

  // Validate enum 'type'
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid membership type" });
  }

  try {
    // Ensure the price includes a '$' symbol, first convert price to a string
    const formattedPrice = typeof price === 'string' && price.startsWith('$') ? price : `$${price}`;

    const newMembership = await Membership.create({
      title,
      description,
      type,
      price: formattedPrice,  // Store the formatted price
      start_date,
      expiry_date,
    });

    res.status(201).json(newMembership);
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};


// Get a membership by ID
exports.getMembershipById = async (req, res) => {
  const { id } = req.params;
  try {
    const membership = await Membership.findOne({ where: { id } });
    if (!membership) {
      return res.status(404).json({ message: "Membership plan not found" });
    }
    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving membership" });
  }
};

// Update a membership by ID
exports.updateMembership = async (req, res) => {
  const { id } = req.params;
  const { title, description, type, price, start_date, expiry_date } = req.body;

  try {
    const membership = await Membership.findOne({ where: { id } });
    if (!membership) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    // Validate and update only provided fields
    membership.title = title !== undefined ? title : membership.title;
    membership.description = description !== undefined ? description : membership.description;
    membership.start_date = start_date !== undefined ? start_date : membership.start_date;
    membership.expiry_date = expiry_date !== undefined ? expiry_date : membership.expiry_date;

    if (type !== undefined) {
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid membership type" });
      }
      membership.type = type;
    }

    // Ensure the price includes a '$' symbol if provided
    if (price !== undefined) {
      const formattedPrice = typeof price === 'string' && price.startsWith('$') ? price : `$${price}`;
      membership.price = formattedPrice;
    }

    await membership.save();
    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({ message: "Error updating membership", error: error.message });
  }
};



// Delete a membership by ID
exports.deleteMembership = async (req, res) => {
  const { id } = req.params;
  try {
    const membership = await Membership.findOne({ where: { id } });
    if (!membership) {
      return res.status(404).json({ message: "Membership plan not found" });
    }
    await membership.destroy();
    res.status(200).json({ message: "Membership plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting membership" });
  }
};

// Get total number of memberships and percentage of each type
exports.getMembershipStats = async (req, res) => {
  try {
    // Get the total number of memberships
    const totalMemberships = await Membership.count();

    if (totalMemberships === 0) {
      return res.status(200).json({
        message: "No memberships found",
        totalMemberships: 0,
        basic: "0%",
        individual: "0%",
        corporate: "0%"
      });
    }

    // Get the count for each membership type
    const basicCount = await Membership.count({ where: { type: 'basic' } });
    const individualCount = await Membership.count({ where: { type: 'individual' } });
    const corporateCount = await Membership.count({ where: { type: 'corporate' } });

    // Calculate percentages
    const basicPercentage = ((basicCount / totalMemberships) * 100).toFixed(2);
    const individualPercentage = ((individualCount / totalMemberships) * 100).toFixed(2);
    const corporatePercentage = ((corporateCount / totalMemberships) * 100).toFixed(2);

    // Return the result
    res.status(200).json({
      totalMemberships,
      basic: `${basicPercentage}%`,
      individual: `${individualPercentage}%`,
      corporate: `${corporatePercentage}%`
    });

  } catch (error) {
    res.status(500).json({ message: "Error retrieving membership stats", error: error.message });
  }
};
