const db = require("../models");
const InformationContact = db.information_contact

// Get all information contacts
exports.getAllInformationContacts = async (req, res) => {
  try {
    const contacts = await InformationContact.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving information contacts" });
  }
};

// Create a new information contact
exports.createInformationContact = async (req, res) => {
  try {
    const { title, description, value, type } = req.body;

    // Check for required fields
    if (!title || !value || !type) {
      return res.status(400).json({ message: "All fields are required: title, value, and type." });
    }

    // Construct the image URL based on the environment, if an image is uploaded
    let image = null; // Default to null
    if (req.file) {
      if (process.env.NODE_ENV === 'production') {
        image = `https://empowerher/${req.file.path.replace(/\\/g, '/')}`; // Production URL
      } else {
        image = `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`; // Development URL
      }
    }

    // Create a new information contact in the database
    const newContact = await InformationContact.create({
      image,
      title,
      description,
      value,
      type
    });

    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};

// Get an information contact by ID
exports.getInformationContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await InformationContact.findOne({ where: { id } });
    if (!contact) {
      return res.status(404).json({ message: "Information contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving information contact" });
  }
};

// Delete an information contact by ID
exports.deleteInformationContact = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await InformationContact.findOne({ where: { id } });
    if (!contact) {
      return res.status(404).json({ message: "Information contact not found" });
    }
    await contact.destroy();
    res.status(200).json({ message: "Information contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting information contact" });
  }
};
