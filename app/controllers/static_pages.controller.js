const db = require("../models");
const StaticPage = db.static_page;

// Get static page content by key
exports.getStaticPageByKey = async (req, res) => {
  const key = req.params.key;
  try {
    const page = await StaticPage.findOne({ where: { key } });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving static page content" });
  }
};

// Create static page content
exports.createStaticPage = async (req, res) => {
  const { key, image, title, description } = req.body;
  try {
    const newPage = await StaticPage.create({ key, image, title, description });
    res.status(201).json(newPage);
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
};

// Update static page content
exports.updateStaticPage = async (req, res) => {
  const { key } = req.body; // Ensure key is passed in the body
  try {
    // Find the static page by key
    const page = await StaticPage.findOne({ where: { key } });
    if (!page) {
      return res.status(404).json({ message: "Static page not found" });
    }

    // Only update fields that are provided in the request body
    if (req.body.image !== undefined) {
      page.image = req.body.image;
    }
    if (req.body.title !== undefined) {
      page.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      page.description = req.body.description;
    }

    // Save the updated page
    await page.save();
    
    res.status(200).json(page);
  } catch (error) {
    console.error('Error updating static page:', error);
    res.status(500).json({ message: "Error updating static page content", error: error.message });
  }
};
