const db = require("../models");
const Organization = db.organization;
const path = require("path");

// Helper function to get uploaded file path
const getFilePath = (file) => {
  if (file) {
    return process.env.NODE_ENV === "production"
      ? `https://your-production-domain.com/uploads/${file.filename}`
      : `http://localhost:8080/uploads/${file.filename}`;
  }
  return null;
};

// Get all organizations
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll();
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Error fetching organizations", error });
  }
};

// Get organization by ID
exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ message: "Error fetching organization", error });
  }
};

// Create a new organization with file uploads
exports.createOrganization = async (req, res) => {
  try {
    const data = {
      ...req.body,
      logo: getFilePath(req.files.logo ? req.files.logo[0] : null),
      products_services: getFilePath(req.files.products_services ? req.files.products_services[0] : null),
    };

    // Required fields check
    const requiredFields = ["user_id", "organization_name", "email", "website", "linkedin", "instagram", "facebook"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const newOrganization = await Organization.create(data);
    res.status(201).json(newOrganization);
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ message: "Error creating organization", error });
  }
};

// Update organization by ID with file uploads
exports.updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const updates = {
      ...req.body,
      logo: req.files.logo ? getFilePath(req.files.logo[0]) : organization.logo,
      products_services: req.files.products_services ? getFilePath(req.files.products_services[0]) : organization.products_services,
    };

    await organization.update(updates);
    res.status(200).json(organization);
  } catch (error) {
    console.error("Error updating organization:", error);
    res.status(500).json({ message: "Error updating organization", error });
  }
};


// Get organization by user_id
exports.getOrganizationByUserId = async (req, res) => {
    try {
      const organization = await Organization.findOne({
        where: { user_id: req.params.user_id },
      });
      if (!organization) {
        return res.status(404).json({ message: "Organization not found for the given user_id" });
      }
      res.status(200).json(organization);
    } catch (error) {
      console.error("Error fetching organization by user_id:", error);
      res.status(500).json({ message: "Error fetching organization by user_id", error });
    }
  };
  

// Delete organization by ID
exports.deleteOrganization = async (req, res) => {
  try {
    const deleted = await Organization.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Error deleting organization:", error);
    res.status(500).json({ message: "Error deleting organization", error });
  }
};
