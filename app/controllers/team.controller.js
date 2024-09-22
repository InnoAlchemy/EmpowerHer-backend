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

// Add a new team member with image upload
exports.addTeamMember = async (req, res) => {
  try {
    const { title, position, description, is_active } = req.body;

    // Check for required fields
    if (!title || !position || !description || req.file === undefined) {
      return res.status(400).json({ message: "All fields are required: title, position, description, and image." });
    }

        // Construct the image URL based on the environment
        let image;
        if (process.env.NODE_ENV === 'production') {
          image = `https://empowerher/${req.file.path.replace(/\\/g, '/')}`; // Production URL
        } else {
          image = `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`; // Development URL
        }
    

    // Create a new team member in the database
    const newMember = await Team.create({
      title,
      position,
      description,
      image,
      is_active: is_active !== undefined ? is_active : true // Default to true if not provided
    });

    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: error.message });
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

    // Update fields only if provided
    if (req.body.title !== undefined) {
      member.title = req.body.title;
    }
    if (req.body.position !== undefined) {
      member.position = req.body.position;
    }
    if (req.body.description !== undefined) {
      member.description = req.body.description;
    }
    
    // Handle image upload
    if (req.file) {
      // Construct the image URL based on the environment
      let image;
      if (process.env.NODE_ENV === 'production') {
        image = `https://empowerher/${req.file.path.replace(/\\/g, '/')}`; // Production URL
      } else {
        image = `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`; // Development URL
      }
      member.image = image; // Update the image URL
    }

    // Update is_active status if provided
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
