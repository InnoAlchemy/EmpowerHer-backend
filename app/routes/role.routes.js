module.exports = (app) => {
  const roleController = require("../controllers/role.controller");
  const authenticateJWT = require("../middleware/Jwt_middleware"); 
  const Admin = require('../middleware/Admin_middleware'); 

  const router = require("express").Router();

  // Get all roles
  router.get("/roles",  roleController.getAllRoles);

  // Get role by ID
  router.get("/roles/:id",  roleController.getRoleById);

  // Create a new role
  router.post("/roles",  roleController.createRole);

  // Update role by ID
  router.put("/roles/:id",  roleController.updateRole);

  // Delete role by ID
  router.delete("/roles/:id",  roleController.deleteRole);

  app.use("/api", router);
};
