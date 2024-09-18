const db = require("../models");
const GetInvolvedProgram = db.get_involved_program;

// Get all active programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await GetInvolvedProgram.findAll({ where: { is_active: true } });
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving programs" });
  }
};

// Add a new program
exports.addProgram = async (req, res) => {
  const {  icon, title, description, is_active } = req.body;
  try {
    const newProgram = await GetInvolvedProgram.create({  icon, title, description, is_active });
    res.status(201).json(newProgram);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get program by ID
exports.getProgramById = async (req, res) => {
  const { id } = req.params;
  try {
    const program = await GetInvolvedProgram.findOne({ where: { id } });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving program" });
  }
};

// Update program details
exports.updateProgram = async (req, res) => {
  const { id } = req.params; // Use the program ID from the request parameters

  try {
    // Find the program by ID
    const program = await GetInvolvedProgram.findOne({ where: { id } });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Only update fields that are provided in the request body
    if (req.body.icon !== undefined) {
      program.icon = req.body.icon;
    }
    if (req.body.title !== undefined) {
      program.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      program.description = req.body.description;
    }
    if (req.body.is_active !== undefined) {
      program.is_active = req.body.is_active;
    }

    // Save the updated program details
    await program.save();

    // Return the updated program details
    res.status(200).json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({ message: "Error updating program", error: error.message });
  }
};


// Delete program by ID
exports.deleteProgram = async (req, res) => {
  const { id } = req.params;
  try {
    const program = await GetInvolvedProgram.findOne({ where: { id } });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    await program.destroy();
    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting program" });
  }
};
