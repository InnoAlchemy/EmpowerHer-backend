const db = require("../models");
const UserTool = db.user_tools;

// Get all user tools
exports.getAllUserTools = async (req, res) => {
  try {
    const userTools = await UserTool.findAll();
    res.status(200).json(userTools);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user tools" });
  }
};

// Link a tool to a user
exports.addUserTool = async (req, res) => {
  const { user_id, discover_her_id } = req.body;
  try {
    const newUserTool = await UserTool.create({
     
      user_id,
      discover_her_id
    });
    res.status(201).json(newUserTool);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get a specific user-tool relation by ID
exports.getUserToolById = async (req, res) => {
  const { id } = req.params;
  try {
    const userTool = await UserTool.findOne({ where: { id } });
    if (!userTool) {
      return res.status(404).json({ message: "User-tool relation not found" });
    }
    res.status(200).json(userTool);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user-tool relation" });
  }
};

// Remove a tool from a user by ID
exports.deleteUserTool = async (req, res) => {
  const { id } = req.params;
  try {
    const userTool = await UserTool.findOne({ where: { id } });
    if (!userTool) {
      return res.status(404).json({ message: "User-tool relation not found" });
    }
    await userTool.destroy();
    res.status(200).json({ message: "Tool removed from user successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user-tool relation" });
  }
};
