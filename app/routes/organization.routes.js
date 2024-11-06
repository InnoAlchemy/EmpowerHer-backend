module.exports = (app) => {
    const organizationController = require("../controllers/organization.controller");
    const upload = require('../middleware/uploadMiddleware'); // This should be the multer configuration file
    const router = require("express").Router();
  
    // Get all organizations
    router.get("/organizations", organizationController.getAllOrganizations);
  
    // Get organization by ID
    router.get("/organizations/:id", organizationController.getOrganizationById);

    // routes/organization.routes.js
    router.get("/organizations/by-user/:user_id", organizationController.getOrganizationByUserId);

  
    // Create a new organization with file uploads
    router.post(
      "/organizations",
      upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "products_services", maxCount: 1 },
      ]),
      organizationController.createOrganization
    );
  
    // Update organization by ID with file uploads
    router.put(
      "/organizations/:id",
      upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "products_services", maxCount: 1 },
      ]),
      organizationController.updateOrganization
    );
  
    // Delete organization by ID
    router.delete("/organizations/:id", organizationController.deleteOrganization);
  
    app.use("/api", router);
  };
  