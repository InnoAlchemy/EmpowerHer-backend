module.exports = (app) => {
    const ApiForPagesController = require("../controllers/combined_api_data_for_pages");
    
    var router = require("express").Router();
    
    // Get homepage data
    router.get('/home', ApiForPagesController.getHomePageData);
    // Get Get Involved data
    router.get('/get-involved', ApiForPagesController.getGetInvolvedPageData);
  
    app.use("/api/combined_api_data_for_pages", router);
  };
  