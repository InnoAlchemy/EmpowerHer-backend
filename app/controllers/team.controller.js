const db = require("../models");
const Team = db.team_member;

// Get all active team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await Team.findAll({ where: { is_active: true } });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving team members" });
  }
};

// Add a new team member
exports.addTeamMember = async (req, res) => {
  const {  title, position, description, image, is_active } = req.body;
  try {
    const newMember = await Team.create({title, position, description, image, is_active });
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get team member by ID
exports.getTeamMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Team.findOne({ where: { id } });
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving team member" });
  }
};

// Update team member details
exports.updateTeamMember = async (req, res) => {
  const { id } = req.params; // Use the team member ID from the request parameters

  try {
    // Find the team member by ID
    const member = await Team.findOne({ where: { id } });
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Only update fields that are provided in the request body
    if (req.body.title !== undefined) {
      member.title = req.body.title;
    }
    if (req.body.position !== undefined) {
      member.position = req.body.position;
    }
    if (req.body.description !== undefined) {
      member.description = req.body.description;
    }
    if (req.body.image !== undefined) {
      member.image = req.body.image;
    }
    if (req.body.is_active !== undefined) {
      member.is_active = req.body.is_active;
    }

    // Save the updated team member details
    await member.save();

    // Return the updated member details
    res.status(200).json(member);
  } catch (error) {
    console.error("Error updating team member details:", error);
    res.status(500).json({ message: "Error updating team member details", error: error.message });
  }
};

// Delete team member by ID
exports.deleteTeamMember = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Team.findOne({ where: { id } });
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    await member.destroy();
    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team member" });
  }
};
