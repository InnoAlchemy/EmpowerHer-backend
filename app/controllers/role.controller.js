const db = require("../models");
const Role = db.role;
const Permission = db.permission;  // Include the Permission model
const RolePermission = db.role_permission;  // Include the RolePermission model

// Get all roles with their permissions
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,  // Include associated permissions
          through: { model: RolePermission },  // Include the RolePermission junction table
        },
      ],
    });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error });
  }
};


// Get role by ID with its permissions
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [
        {
          model: Permission,  // Include associated permissions
          through: { model: RolePermission },  // Include the RolePermission junction table
        },
      ],
    });

    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching role", error });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Role name is required." });
    }

    const newRole = await Role.create({
      name,
      
    });

    res.status(201).json(newRole);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Error creating role", error: error.message });
  }
};

// Update role by ID
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, } = req.body;

    // Find the role by ID
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    // Update only the fields that are provided
    if (name !== undefined) role.name = name;
    

    await role.save();
    res.status(200).json(role);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
};

// Delete role by ID
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the role
    const deleted = await Role.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: "Role deleted successfully." });
    } else {
      res.status(404).json({ message: "Role not found." });
    }
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Error deleting role", error: error.message });
  }
};
