const db = require("../models");
const PageSection = db.page_sections;
const Page= db.page;

 // Allowed enum values
 const allowedPositions = ["left", "right", "center"];
 const allowedTypes = ["content_box", "list"];


// Get all page sections
exports.getAllSections = async (req, res) => {
  try {
    const sections = await PageSection.findAll();
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving page sections" });
  }
};

// Add a new section to a page
exports.addSection = async (req, res) => {
  const { page_id, title, description, image, position, type } = req.body;

  // Validate position
  if (!allowedPositions.includes(position)) {
    return res.status(400).json({ message: "Invalid position value" });
  }

  // Validate type
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid type value" });
  }

  try {
    // Create new section with validated input
    const newSection = await PageSection.create({
      page_id,
      title,
      description,
      image,
      position,
      type
    });
    res.status(201).json(newSection);
  } catch (error) {
    console.error("Error adding section:", error);
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
};


// Get a page section by ID
exports.getSectionById = async (req, res) => {
  const { id } = req.params;
  try {
    const section = await PageSection.findOne({ where: { id } });
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving section" });
  }
};

// Update a section by ID
exports.updateSection = async (req, res) => {
  const { id } = req.params;
  const { page_id, title, description, image, position, type } = req.body;

 
  try {
    // Find the section by ID
    const section = await PageSection.findOne({ where: { id } });
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Check if the page exists if page_id is provided
    if (page_id) {
      const pageExists = await Page.findOne({ where: { id: page_id } });
      if (!pageExists) {
        return res.status(404).json({ message: "Page not found" });
      }
      section.page_id = page_id;
    }

    // Update only fields that are present in the request body with validation
    if (title !== undefined) {
      section.title = title;
    }
    if (description !== undefined) {
      section.description = description;
    }
    if (image !== undefined) {
      section.image = image;
    }
    if (position !== undefined) {
      if (!allowedPositions.includes(position)) {
        return res.status(400).json({ message: "Invalid position value" });
      }
      section.position = position;
    }
    if (type !== undefined) {
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid type value" });
      }
      section.type = type;
    }

    // Save the updated section
    await section.save();
    res.status(200).json(section);
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ message: "Error updating section", error: error.message });
  }
};

// Delete a section by ID
exports.deleteSection = async (req, res) => {
  const { id } = req.params;
  try {
    const section = await PageSection.findOne({ where: { id } });
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    await section.destroy();
    res.status(200).json({ message: "Section deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting section" });
  }
};


// Get a page by ID along with all its sections
exports.getPageWithSections = async (req, res) => {
  const { page_id } = req.params;

  try {
    // Find the page and include its associated sections
    const page = await Page.findOne({
      where: { id: page_id },
      include: [
        {
          model: PageSection,
         
        }
      ]
    });

    // Check if the page exists
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Return the page along with its sections
    res.status(200).json(page);
  } catch (error) {
    console.error("Error retrieving page and sections:", error);
    res.status(500).json({ message: "Error retrieving page and sections", error: error.message });
  }
};
