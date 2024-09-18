module.exports = (app) => {
    const pageSectionsController = require("../controllers/page_sections.controller");
  
    var router = require("express").Router();
  
    // Get all page sections
    router.get('/page_sections', pageSectionsController.getAllSections);
  
    // Add a new section to a page
    router.post('/page_sections', pageSectionsController.addSection);
  
    // Get a page section by ID
    router.get('/page_sections/:id', pageSectionsController.getSectionById);
  
    // Update a page section by ID
    router.put('/page_sections/:id', pageSectionsController.updateSection);
  
    // Delete a page section by ID
    router.delete('/page_sections/:id', pageSectionsController.deleteSection);

    // Get All Page section for a single page
   router.get('/page-sections-by-page_id/:page_id', pageSectionsController.getPageWithSections);

  
    app.use("/api", router);
  };
  