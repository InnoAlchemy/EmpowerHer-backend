const db = require("../models");
const Form = db.forms;
const transporter = require("../config/email.config");
const path = require("path");
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
  const { first_name, last_name, email, phone_number, category, organization, status } = req.body;
  let content;

  try {
    // Check if a file was uploaded
    if (req.file) {
      content = req.file.path; // Store the file path for the uploaded text file
    } else {
      content = req.body.content; // Use normal message content
    }

    const newForm = await Form.create({
      first_name,
      last_name,
      email,
      phone_number,
      content,
      category,
      organization,
      status,
    });

    // Prepare email content
    let emailBody = "A new form has been submitted:\n\n";
    
    // Include fields in the email body only if they have values
    if (first_name) emailBody += `First Name: ${first_name}\n`;
    if (last_name) emailBody += `Last Name: ${last_name}\n`;
    if (email) emailBody += `Email: ${email}\n`;
    if (phone_number) emailBody += `Phone Number: ${phone_number}\n`;
    if (category) emailBody += `Category: ${category}\n`;
    if (organization) emailBody += `Organization: ${organization}\n`;
    if (status) emailBody += `Status: ${status}\n`;

    // Add content message
    if (req.file) {
      emailBody += `Content: See attached file for additional content.\n`;
    } else if (content) {
      emailBody += `Content: ${content}\n`;
    }

    const mailOptions = {
      from: email, // Set the sender's email to the user's email
      to: process.env.EMAIL_USER, // Recipient's email (your admin email)
      subject: "New Form Submission", // Subject line
      text: emailBody, // Set the constructed email body
      attachments: [], // Initialize attachments array
    };

    // If a file is uploaded, attach it to the email
    if (req.file) {
      mailOptions.attachments.push({
        filename: path.basename(content), // Use the filename from the path
        path: content, // Path to the uploaded file
      });
    }

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with the created form
    res.status(201).json(newForm);
  } catch (error) {
    console.error(error);
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
