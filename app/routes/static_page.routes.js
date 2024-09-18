module.exports = (app) => {
    const staticPagesController = require("../controllers/static_pages.controller");
    const authenticateJWT = require('../middleware/Jwt_middleware'); 
    var router = require("express").Router();
  
    // Get static page content by key
    router.get('/content_static_pages/:key',authenticateJWT, staticPagesController.getStaticPageByKey);
  
    // Create static page content
    router.post('/content_static_pages',authenticateJWT, staticPagesController.createStaticPage);
  
    // Update static page content
    router.put('/content_static_pages',authenticateJWT, staticPagesController.updateStaticPage);
  
    app.use("/api", router);
  };
  