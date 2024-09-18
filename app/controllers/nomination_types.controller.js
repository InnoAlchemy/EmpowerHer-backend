const db = require("../models");
const NominationType = db.nomination_types;

// Get all nomination types
exports.getAllNominationTypes = async (req, res) => {
  try {
    const nominationTypes = await NominationType.findAll();
    res.status(200).json(nominationTypes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving nomination types" });
  }
};

// Create a new nomination type
exports.addNominationType = async (req, res) => {
  const { title, is_active } = req.body;
  try {
    const newNominationType = await NominationType.create({
      title,
      is_active
    });
    res.status(201).json(newNominationType);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get a nomination type by ID
exports.getNominationTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const nominationType = await NominationType.findOne({ where: { id } });
    if (!nominationType) {
      return res.status(404).json({ message: "Nomination type not found" });
    }
    res.status(200).json(nominationType);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving nomination type" });
  }
};

// Delete a nomination type by ID
exports.deleteNominationType = async (req, res) => {
  const { id } = req.params;
  try {
    const nominationType = await NominationType.findOne({ where: { id } });
    if (!nominationType) {
      return res.status(404).json({ message: "Nomination type not found" });
    }
    await nominationType.destroy();
    res.status(200).json({ message: "Nomination type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting nomination type" });
  }
};
