const db = require("../models");
const PartnershipType = db.partnership_types;

// Get all partnership types
exports.getAllPartnershipTypes = async (req, res) => {
  try {
    const partnershipTypes = await PartnershipType.findAll();
    res.status(200).json(partnershipTypes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving partnership types" });
  }
};

// Create a new partnership type
exports.addPartnershipType = async (req, res) => {
  const {  title, is_active } = req.body;
  try {
    const newPartnershipType = await PartnershipType.create({
      title,
      is_active
    });
    res.status(201).json(newPartnershipType);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get a partnership type by ID
exports.getPartnershipTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const partnershipType = await PartnershipType.findOne({ where: { id } });
    if (!partnershipType) {
      return res.status(404).json({ message: "Partnership type not found" });
    }
    res.status(200).json(partnershipType);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving partnership type" });
  }
};

// Delete a partnership type by ID
exports.deletePartnershipType = async (req, res) => {
  const { id } = req.params;
  try {
    const partnershipType = await PartnershipType.findOne({ where: { id } });
    if (!partnershipType) {
      return res.status(404).json({ message: "Partnership type not found" });
    }
    await partnershipType.destroy();
    res.status(200).json({ message: "Partnership type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting partnership type" });
  }
};
