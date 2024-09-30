module.exports = (app) => {
    const pagesController = require("../controllers/page.controller");
    const upload = require('../middleware/uploadMiddleware'); 
    var router = require("express").Router();
  
    // Get all pages
    router.get('/pages', pagesController.getAllPages);
  
    // Add a new page
    router.post('/pages',upload.single('header_image'), pagesController.addPage);
  
    // Get a page by ID
    router.get('/pages/:id', pagesController.getPageById);
  
    // Update a page by ID
    router.put('/pages/:id',upload.single('header_image'), pagesController.updatePage);
  
    // Delete a page by ID
    router.delete('/pages/:id', pagesController.deletePage);
  
    app.use("/api", router);
  };
  