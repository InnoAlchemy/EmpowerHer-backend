// controllers/get_involved_programs.controller.js

const db = require("../models");
const GetInvolvedProgram = db.get_involved_program;
const path = require('path');
const fs = require('fs');

// Get all active programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await GetInvolvedProgram.findAll({ where: { is_active: true } });
    res.status(200).json(programs);
  } catch (error) {
    console.error("Error retrieving programs:", error);
    res.status(500).json({ message: "Error retrieving programs" });
  }
};

// Add a new program
exports.addProgram = async (req, res) => {
  const { title, description, is_active } = req.body;

  // Check for required icon file
  if (!req.file) {
    return res.status(400).json({ message: "Icon is required." });
  }

  // Construct the icon URL based on the environment
  const icon = process.env.NODE_ENV === 'production'
    ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
    : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;

  try {
    const newProgram = await GetInvolvedProgram.create({ icon, title, description, is_active });
    res.status(201).json(newProgram);
  } catch (error) {
    console.error("Error adding program:", error);
    res.status(400).json({ message: "Invalid input", error: error.message });
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
    console.error("Error retrieving program:", error);
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

    // Initialize an object to hold updated fields
    const updatedFields = {};

    // If a new icon file is uploaded, process it
    if (req.file) {
      // Construct the new icon URL
      const newIcon = process.env.NODE_ENV === 'production'
        ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
        : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;

      updatedFields.icon = newIcon;

      // Optionally, delete the old icon file from the server to free up space
      // This assumes the old icon URL contains the file path
      if (program.icon) {
        try {
          const oldIconPath = path.join(__dirname, '..', '..', 'uploads', path.basename(program.icon));
          if (fs.existsSync(oldIconPath)) {
            fs.unlinkSync(oldIconPath);
            console.log(`Deleted old icon: ${oldIconPath}`);
          }
        } catch (err) {
          console.error(`Error deleting old icon: ${err.message}`);
          // Not sending an error response here to avoid failing the entire update due to cleanup issues
        }
      }
    }

    // Update other fields if provided
    if (req.body.title !== undefined) {
      updatedFields.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      updatedFields.description = req.body.description;
    }
    if (req.body.is_active !== undefined) {
      updatedFields.is_active = req.body.is_active;
    }

    // Update the program with the new fields
    await program.update(updatedFields);

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

    // Optionally, delete the icon file from the server
    if (program.icon) {
      try {
        const iconPath = path.join(__dirname, '..', '..', 'uploads', path.basename(program.icon));
        if (fs.existsSync(iconPath)) {
          fs.unlinkSync(iconPath);
          console.log(`Deleted icon: ${iconPath}`);
        }
      } catch (err) {
        console.error(`Error deleting icon: ${err.message}`);
        // Not sending an error response here to avoid failing the entire delete due to cleanup issues
      }
    }

    await program.destroy();
    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Error deleting program:", error);
    res.status(500).json({ message: "Error deleting program" });
  }
};
