module.exports = (app) => {
    const informationContactsController = require("../controllers/information_contacts.controller");
    const upload = require('../middleware/uploadMiddleware'); 
    var router = require("express").Router();
  
    // Get all information contacts
    router.get('/information_contacts', informationContactsController.getAllInformationContacts);
  
    // Create a new information contact
    router.post('/information_contacts',upload.single('image'), informationContactsController.createInformationContact);
  
    // Get an information contact by ID
    router.get('/information_contacts/:id', informationContactsController.getInformationContactById);
  
    // Delete an information contact by ID
    router.delete('/information_contacts/:id', informationContactsController.deleteInformationContact);
  
    app.use("/api", router);
  };
  