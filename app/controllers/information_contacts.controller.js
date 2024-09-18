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
  const { image, title, description, value, type } = req.body;
  try {
    const newContact = await InformationContact.create({
      image,
      title,
      description,
      value,
      type
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
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
