module.exports = (app) => {
    const staticPagesController = require("../controllers/static_pages.controller");
    const upload = require('../middleware/uploadMiddleware'); 
    const authenticateJWT = require('../middleware/Jwt_middleware'); 
    const hasPermission = require('../middleware/Role_Permissions_middleware');
    var router = require("express").Router();

     // Get All static pages
     router.get('/content_static_pages/',authenticateJWT, staticPagesController.getAllStaticPages);
  
    // Get static page content by key
    router.get('/content_static_pages/:key',authenticateJWT, staticPagesController.getStaticPageByKey);
  
    // Create static page content
    router.post('/content_static_pages',authenticateJWT,upload.single('image'), staticPagesController.createStaticPage);
  
    // Update static page content
    router.put('/content_static_pages/:id',authenticateJWT,upload.single('image'), staticPagesController.updateStaticPage);
  
    app.use("/api", router);
  };
  