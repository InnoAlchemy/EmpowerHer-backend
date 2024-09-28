const db = require("../models");
const Form = db.forms;

// Get all forms
exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.findAll();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving forms" });
  }
};

// Submit a new form
exports.submitForm = async (req, res) => {
  const { first_name, last_name, email, phone_number, content, category,organization,status,type, } = req.body;
  try {
    const newForm = await Form.create({
      first_name,
      last_name,
      email,
      phone_number,
      content,
      category,
      organization,
      status,
      type,
      
    });
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get a form by ID
exports.getFormById = async (req, res) => {
  const { id } = req.params;
  try {
    const form = await Form.findOne({ where: { id } });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving form" });
  }
};

// Delete a form by ID
exports.deleteForm = async (req, res) => {
  const { id } = req.params;
  try {
    const form = await Form.findOne({ where: { id } });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    await form.destroy();
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form" });
  }
};
