const db = require("../models");
const Page = db.page;

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pages" });
  }
};

// Add a new page
exports.addPage = async (req, res) => {
  const { header_image, title, description } = req.body;
  try {
    const newPage = await Page.create({ header_image, title, description });
    res.status(201).json(newPage);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Get a page by ID
exports.getPageById = async (req, res) => {
  const { id } = req.params;
  try {
    const page = await Page.findOne({ where: { id } });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving page" });
  }
};

// Update page details
exports.updatePage = async (req, res) => {
  const { id } = req.params;
  const { header_image, title, description } = req.body;
  
  try {
    const page = await Page.findOne({ where: { id } });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Update only fields that are present in the request body
    if (header_image !== undefined) {
      page.header_image = header_image;
    }
    if (title !== undefined) {
      page.title = title;
    }
    if (description !== undefined) {
      page.description = description;
    }

    // Save the updated page
    await page.save();
    res.status(200).json(page);
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ message: "Error updating page", error: error.message });
  }
};


// Delete a page by ID
exports.deletePage = async (req, res) => {
  const { id } = req.params;
  try {
    const page = await Page.findOne({ where: { id } });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    await page.destroy();
    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting page" });
  }
};
