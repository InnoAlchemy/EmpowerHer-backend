module.exports = (app) => {
    const permissionController = require("../controllers/permission.controller");
  
    const router = require("express").Router();
  
    // Get all permissions
    router.get('/permissions', permissionController.getAllPermissions);
  
    // Add a new permission
    router.post('/permissions', permissionController.addPermission);
  
    // Get permission by ID
    router.get('/permissions/:id', permissionController.getPermissionById);
  
    // Update permission details
    router.put('/permissions/:id', permissionController.updatePermission);
  
    // Delete permission by ID
    router.delete('/permissions/:id', permissionController.deletePermission);
  
    app.use("/api", router);
  };
  