const db = require("../models");
const Permission = db.permission;

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving permissions" });
  }
};

// Add a new permission
exports.addPermission = async (req, res) => {
  const { name } = req.body;
  try {
    const newPermission = await Permission.create({ name });
    res.status(201).json(newPermission);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get permission by ID
exports.getPermissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findOne({ where: { id } });
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving permission" });
  }
};

// Update permission details
exports.updatePermission = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const permission = await Permission.findOne({ where: { id } });
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    // Update permission name if provided
    if (name !== undefined) {
      permission.name = name;
    }

    await permission.save();
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Error updating permission" });
  }
};

// Delete permission by ID
exports.deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findOne({ where: { id } });
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    await permission.destroy();
    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting permission" });
  }
};
