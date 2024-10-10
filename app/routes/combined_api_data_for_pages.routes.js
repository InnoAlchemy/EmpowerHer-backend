module.exports = (app) => {
    const ApiForPagesController = require("../controllers/combined_api_data_for_pages");
    
    var router = require("express").Router();
    
    // Get homepage data
    router.get('/home', ApiForPagesController.getHomePageData);
  
    app.use("/api/combined_api_data_for_pages", router);
  };
  