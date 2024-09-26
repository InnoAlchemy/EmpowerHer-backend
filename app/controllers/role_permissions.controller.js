const db = require("../models");
const RolePermission = db.role_permission;
const Role = db.role;
const Permission = db.permission;

// Get all role_permissions
exports.getAllRolePermissions = async (req, res) => {
    try {
        const rolePermissions = await RolePermission.findAll({
            include: [
                { model: Role, attributes: ['id', 'name'] },
                { model: Permission, attributes: ['id', 'name'] },
            ]
        });
        res.status(200).json(rolePermissions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching role_permissions", error });
    }
};

// Get role_permission by ID
exports.getRolePermissionById = async (req, res) => {
    const { id } = req.params;
    try {
        const rolePermission = await RolePermission.findByPk(id, {
            include: [
                { model: Role, attributes: ['id', 'name'] },
                { model: Permission, attributes: ['id', 'name'] },
            ]
        });
        if (rolePermission) {
            res.status(200).json(rolePermission);
        } else {
            res.status(404).json({ message: "Role permission not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching role_permission", error });
    }
};

// Create new role_permission
exports.createRolePermission = async (req, res) => {
    const { roleId, permissionIds } = req.body; // Accept an array of permission IDs

    try {
        // Validate input
        if (!roleId || !permissionIds || !Array.isArray(permissionIds)) {
            return res.status(400).json({ message: "Role ID and an array of Permission IDs are required." });
        }

        // Prepare data for bulk create in role_permission
        const rolePermissions = permissionIds.map(permissionId => ({
            role_id: roleId,
            permission_id: permissionId
        }));

        // Create role-permission associations
        const newRolePermissions = await RolePermission.bulkCreate(rolePermissions);

        res.status(201).json(newRolePermissions);
    } catch (error) {
        console.error("Error creating role_permission:", error);
        res.status(500).json({ message: "Error creating role_permission", error: error.message });
    }
};

// Update role_permission by ID
exports.updateRolePermission = async (req, res) => {
    const { id } = req.params;
    const { roleId, permissionIds } = req.body; // Accept an array of permission IDs

    try {
        const rolePermission = await RolePermission.findByPk(id);
        if (!rolePermission) {
            return res.status(404).json({ message: "Role permission not found." });
        }

        // Update only the fields that are provided
        if (roleId !== undefined) rolePermission.role_id = roleId;

        // If permissionIds is provided, update role_permissions
        if (permissionIds && Array.isArray(permissionIds)) {
            // Clear existing permissions for this role
            await RolePermission.destroy({ where: { role_id: rolePermission.role_id } });

            // Prepare data for bulk create in role_permission
            const rolePermissions = permissionIds.map(permissionId => ({
                role_id: rolePermission.role_id,
                permission_id: permissionId,
            }));

            // Create new role-permission associations
            await RolePermission.bulkCreate(rolePermissions);
        }

        res.status(200).json(rolePermission);
    } catch (error) {
        console.error("Error updating role_permission:", error);
        res.status(500).json({ message: "Error updating role_permission", error: error.message });
    }
};

// Delete role_permission by ID
exports.deleteRolePermission = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await RolePermission.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: "Role permission deleted successfully." });
        } else {
            res.status(404).json({ message: "Role permission not found." });
        }
    } catch (error) {
        console.error("Error deleting role_permission:", error);
        res.status(500).json({ message: "Error deleting role_permission", error: error.message });
    }
};
