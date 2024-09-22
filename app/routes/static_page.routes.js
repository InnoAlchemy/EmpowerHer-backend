module.exports = (app) => {
    const staticPagesController = require("../controllers/static_pages.controller");
    const upload = require('../middleware/uploadMiddleware'); 
    const authenticateJWT = require('../middleware/Jwt_middleware'); 
    const hasPermission = require('../middleware/Role_Permissions_middleware');
    var router = require("express").Router();
  
    // Get static page content by key
    router.get('/content_static_pages/:key',authenticateJWT,hasPermission('READ'), staticPagesController.getStaticPageByKey);
  
    // Create static page content
    router.post('/content_static_pages',authenticateJWT,upload.single('image'), hasPermission('CREATE'), staticPagesController.createStaticPage);
  
    // Update static page content
    router.put('/content_static_pages',authenticateJWT,upload.single('image'), hasPermission('UPDATE'), staticPagesController.updateStaticPage);
  
    app.use("/api", router);
  };
  