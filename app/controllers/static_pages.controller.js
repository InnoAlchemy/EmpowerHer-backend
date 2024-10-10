const db = require("../models");
const StaticPage = db.static_page;

// Get all static pages
exports.getAllStaticPages = async (req, res) => {
  try {
    // Retrieve all static pages from the database
    const pages = await StaticPage.findAll();
    
    // Check if there are any static pages
    if (pages.length === 0) {
      return res.status(404).json({ message: "No static pages found" });
    }

    // Return the list of static pages
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error retrieving static pages:', error);
    res.status(500).json({ message: "Error retrieving static pages", error: error.message });
  }
};


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
  const { key, title, description, button_link,button_text } = req.body;

  // Check for required fields
  if (!req.file) {
    return res.status(400).json({ message: "Image is required." });
  }

  // Construct the image URL based on the environment
  const image = process.env.NODE_ENV === 'production' 
    ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
    : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;

  try {
    const newPage = await StaticPage.create({ key, image, title, description,button_link,button_text });
    res.status(201).json(newPage);
  } catch (error) {
    console.error("Error creating static page:", error);
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};


// Update static page content by ID
exports.updateStaticPage = async (req, res) => {
  const { id } = req.params; // Get the static page ID from the request parameters
  const { key,title, description, button_link, button_text } = req.body; // Fields to be updated

  try {
    // Find the static page by ID
    const page = await StaticPage.findOne({ where: { id } });
    
    if (!page) {
      return res.status(404).json({ message: "Static page not found" });
    }

    // Only update fields that are provided in the request body
    if (req.file) {
      page.image = process.env.NODE_ENV === 'production' 
        ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}` 
        : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;
    }

    if(key!==undefined){
      page.key = key;
    }

    if (title !== undefined) {
      page.title = title;
    }

    if (description !== undefined) {
      page.description = description;
    }

    if (button_text !== undefined) {
      page.button_text = button_text;
    }

    if (button_link !== undefined) {
      page.button_link = button_link;
    }

    // Save the updated page
    await page.save();
    
    res.status(200).json(page);
  } catch (error) {
    console.error('Error updating static page:', error);
    res.status(500).json({ message: "Error updating static page content", error: error.message });
  }
};
