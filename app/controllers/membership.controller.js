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
  const { title, description, type, price } = req.body;

  // Validate enum 'type'
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid membership type" });
  }

  try {
    const newMembership = await Membership.create({
      title,
      description,
      type,
      price,
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
  const { title, description, type, price } = req.body;

  try {
    const membership = await Membership.findOne({ where: { id } });
    if (!membership) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    // Validate and update only provided fields
    membership.title = title !== undefined ? title : membership.title;
    membership.description = description !== undefined ? description : membership.description;
    if (type !== undefined) {
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid membership type" });
      }
      membership.type = type;
    }
    membership.price = price !== undefined ? price : membership.price;

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
