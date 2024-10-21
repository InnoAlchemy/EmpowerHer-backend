const db = require("../models");
const NominationForm = db.nomination_form;
const NominationType = db.nomination_types;
const transporter = require("../config/email.config");
const path = require("path");

// Get all Nomination forms
exports.getAllForms = async (req, res) => {
  try {
    const nomination_forms = await NominationForm.findAll({
        include: [{
          model: NominationType, 
         
        }]
      });
    res.status(200).json(nomination_forms);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Nomination Forms" });
  }
};

// Submit a new Nomiantion form
exports.submitForm = async (req, res) => {
    const {
      nomination_type_id,
      nominator_full_name,
      nominee_full_name,
      nominator_email,
      nominee_email,
      category,
    } = req.body;
    let reason_for_nomination;
  
    try {
      // Check if a file was uploaded
      if (req.file) {
        reason_for_nomination = req.file.path; // Store the file path for the uploaded text file
      } else {
        reason_for_nomination = req.body.reason_for_nomination; // Use normal message reason_for_nomination
      }
  
      // Create the new NominationForm and include NominationType to access the title
      const newForm = await NominationForm.create(
        {
          nomination_type_id,
          nominator_full_name,
          nominee_full_name,
          nominator_email,
          nominee_email,
          reason_for_nomination,
          category: category || 'nomination_type',
        },
        {
          include: [
            {
              model: NominationType,
              attributes: ['title'], // Only fetch the title
            },
          ],
        }
      );
  
      // Alternatively, if the above include doesn't work as expected,
      // fetch the NominationType separately
      const nominationType = await NominationType.findByPk(nomination_type_id);
  
      // Prepare email body
      let emailBody = 'A new Nomination Form has been submitted:\n\n';
  
      // Use the title instead of the ID
      if (nominationType && nominationType.title) {
        emailBody += `Nomination Type: ${nominationType.title}\n`;
      } else if (nomination_type_id) {
        // Fallback in case title is not available
        emailBody += `Nomination Type ID: ${nomination_type_id}\n`;
      }
  
      if (nominator_full_name) emailBody += `Nominator Full Name: ${nominator_full_name}\n`;
      if (nominee_full_name) emailBody += `Nominee's Full Name: ${nominee_full_name}\n`;
      if (nominator_email) emailBody += `Nominator's Email: ${nominator_email}\n`;
      if (nominee_email) emailBody += `Nominee's Email: ${nominee_email}\n`;
      if (category) emailBody += `Category: ${category}\n`;
  
      // Add Reason For Nomination message
      if (req.file) {
        emailBody += `Reason For Nomination: See attached file for additional Reason For Nomination.\n`;
      } else if (reason_for_nomination) {
        emailBody += `Reason For Nomination: ${reason_for_nomination}\n`;
      }
  
      const mailOptions = {
        from: nominator_email, // Set the sender's email to the user's email
        to: process.env.EMAIL_USER, // Recipient's email (your admin email)
        subject: 'New Form Submission', // Subject line
        text: emailBody, // Set the constructed email body
        attachments: [], // Initialize attachments array
      };
  
      // If a file is uploaded, attach it to the email
      if (req.file) {
        mailOptions.attachments.push({
          filename: path.basename(reason_for_nomination), // Use the filename from the path
          path: reason_for_nomination, // Path to the uploaded file
        });
      }
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Respond with the created form
      res.status(201).json(newForm);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Invalid input' });
    }
  };
  
// Get a Nomination form by ID
exports.getFormById = async (req, res) => {
  const { id } = req.params;
  try {
    const form = await NominationForm.findOne({ where: { id },include: [{
        model: NominationType, 
       
      }] });
    if (!form) {
      return res.status(404).json({ message: "Nomination Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Nomination Form" });
  }
};

// Delete a Nomination form by ID
exports.deleteForm = async (req, res) => {
  const { id } = req.params;
  try {
    const form = await NominationForm.findOne({ where: { id } });
    if (!form) {
      return res.status(404).json({ message: "Nomination Form not found" });
    }
    await form.destroy();
    res.status(200).json({ message: "Nomination Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Form" });
  }
};
