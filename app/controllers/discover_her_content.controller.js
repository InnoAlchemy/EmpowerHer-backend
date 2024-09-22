const db = require("../models");
const DiscoverHerContent = db.discover_her_content;
 // Allowed categories
 const allowedCategories = ["article", "video", "tools"];
// Get all active content
exports.getAllContent = async (req, res) => {
  try {
    const content = await DiscoverHerContent.findAll({ where: { is_active: true } });
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving content" });
  }
};

// Add new content
exports.addContent = async (req, res) => {
  const { category, title, description, is_active, date } = req.body;

  // Validate category
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category value" });
  }

  // Check for required file
  if (!req.file) {
    return res.status(400).json({ message: "Header file is required." });
  }

  // Construct the header_file URL based on the environment
  const header_file = process.env.NODE_ENV === 'production' 
    ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
    : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;

  try {
    // Create new content with validated input
    const newContent = await DiscoverHerContent.create({
      category,
      header_file,
      title,
      description,
      is_active,
      date
    });
    
    res.status(201).json(newContent);
  } catch (error) {
    console.error("Error adding content:", error);
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};
// Get content by ID
exports.getContentById = async (req, res) => {
  const { id } = req.params;
  try {
    const content = await DiscoverHerContent.findOne({ where: { id } });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving content" });
  }
};

// Update content details
// Update content details
exports.updateContent = async (req, res) => {
  const { id } = req.params; // Use the content ID from the request parameters

  try {
    // Find the content by ID
    const content = await DiscoverHerContent.findOne({ where: { id } });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Only update fields that are provided in the request body
    if (req.body.category !== undefined) {
      // Validate category
      if (!allowedCategories.includes(req.body.category)) {
        return res.status(400).json({ message: "Invalid category value" });
      }
      content.category = req.body.category;
    }
    
    if (req.file) {
      content.header_file = process.env.NODE_ENV === 'production' 
        ? `https://empowerher/${req.file.path.replace(/\\/g, '/')}`
        : `http://localhost:8080/${req.file.path.replace(/\\/g, '/')}`;
    }
    
    if (req.body.title !== undefined) {
      content.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      content.description = req.body.description;
    }
    if (req.body.is_active !== undefined) {
      content.is_active = req.body.is_active;
    }
    if (req.body.date !== undefined) {
      content.date = req.body.date;
    }

    // Save the updated content details
    await content.save();

    // Return the updated content details
    res.status(200).json(content);
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Error updating content", error: error.message });
  }
};

// Delete content by ID
exports.deleteContent = async (req, res) => {
  const { id } = req.params;
  try {
    const content = await DiscoverHerContent.findOne({ where: { id } });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    await content.destroy();
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting content" });
  }
};
