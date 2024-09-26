module.exports = (app) => {
  const rolePermissionsController = require("../controllers/role_permissions.controller");
  const router = require("express").Router();

  // Get all role_permissions
  router.get('/role_permissions', rolePermissionsController.getAllRolePermissions);

  // Get role_permission by ID
  router.get('/role_permissions/:id', rolePermissionsController.getRolePermissionById);

  // Create a new role_permission
  router.post('/role_permissions', rolePermissionsController.createRolePermission);

  // Update role_permission by ID
  router.put('/role_permissions/:id', rolePermissionsController.updateRolePermission);

  // Delete role_permission by ID
  router.delete('/role_permissions/:id', rolePermissionsController.deleteRolePermission);

  app.use("/api", router);
};
