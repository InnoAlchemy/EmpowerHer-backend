const db = require("../models");
const PartnershipForm = db.partnership_form;
const PartnershipType = db.partnership_types;
const transporter = require("../config/email.config");
const path = require("path");

// Get all Partnership forms
exports.getAllForms = async (req, res) => {
  try {
    const partnership_forms = await PartnershipForm.findAll({
        include: [{
          model: PartnershipType, 
         
        }]
      });
    res.status(200).json(partnership_forms);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Partnership Forms" });
  }
};

// Submit a new Partnership form
exports.submitForm = async (req, res) => {
    const {
      partnership_type_id,
      organization_name,
      contact_person_full_name,
      contact_person_email,
      phone_number,
      category,
    } = req.body;
    let description_of_proposal;
  
    try {
      // Check if a file was uploaded
      if (req.file) {
        description_of_proposal = req.file.path; // Store the file path for the uploaded text file
      } else {
        description_of_proposal = req.body.description_of_proposal; // Use normal message description_of_proposal
      }
  
      // Create the new PartnershipForm
      const newForm = await PartnershipForm.create({
        partnership_type_id,
        organization_name,
        contact_person_full_name,
        contact_person_email,
        description_of_proposal,
        category: category || 'partnership_type',
        phone_number,
      });
  
      // Fetch the associated PartnershipType to get the title
      const partnershipType = await PartnershipType.findByPk(partnership_type_id);
  
      // Prepare email body
      let emailBody = "A new Partnership form has been submitted:\n\n";
  
      // Use the title instead of the ID
      if (partnershipType && partnershipType.title) {
        emailBody += `Partnership Type: ${partnershipType.title}\n`;
      } else if (partnership_type_id) {
        // Fallback in case title is not available
        emailBody += `Partnership Type ID: ${partnership_type_id}\n`;
      }
  
      if (organization_name) emailBody += `Organization Full Name: ${organization_name}\n`;
      if (contact_person_full_name) emailBody += `Contact Person Full Name: ${contact_person_full_name}\n`;
      if (contact_person_email) emailBody += `Contact Person Email: ${contact_person_email}\n`;
      if (phone_number) emailBody += `Contact Person Phone Number: ${phone_number}\n`;
      if (category) emailBody += `Category: ${category}\n`;
  
      // Add Description Of Proposal message
      if (req.file) {
        emailBody += `Description Of Proposal: See attached file for additional description of proposal.\n`;
      } else if (description_of_proposal) {
        emailBody += `Description Of Proposal: ${description_of_proposal}\n`;
      }
  
      const mailOptions = {
        from: contact_person_email, // Set the sender's email to the user's email
        to: process.env.EMAIL_USER, // Recipient's email (your admin email)
        subject: "New Partnership Form Submission", // Subject line
        text: emailBody, // Set the constructed email body
        attachments: [], // Initialize attachments array
      };
  
      // If a file is uploaded, attach it to the email
      if (req.file) {
        mailOptions.attachments.push({
          filename: path.basename(description_of_proposal), // Use the filename from the path
          path: description_of_proposal, // Path to the uploaded file
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
// Get a Partnership form by ID
exports.getFormById = async (req, res) => {
  const { id } = req.params;
  try {
    const form = await PartnershipForm.findOne({ where: { id },
        include: [{
          model: PartnershipType, 
         
        }]
      } );
    if (!form) {
      return res.status(404).json({ message: "Partnership Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Partnership Form" });
  }
};

// Delete a Partnership form by ID
exports.deleteForm = async (req, res) => {
  const { id } = req.params;
  try {
    const form = await PartnershipForm.findOne({ where: { id } });
    if (!form) {
      return res.status(404).json({ message: "Partnership Form not found" });
    }
    await form.destroy();
    res.status(200).json({ message: "Partnership Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form" });
  }
};
