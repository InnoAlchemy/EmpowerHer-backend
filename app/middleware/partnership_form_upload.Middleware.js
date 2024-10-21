const multer = require("multer");
const path = require("path");

// Set up storage for text files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "text-uploads"); // Destination folder for uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E6); // Generate a unique filename
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with unique name
  }
});

// Create the multer upload instance
const partnershipfileupload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only .txt files
    if (file.mimetype === "text/plain") {
      cb(null, true);
    } else {
      cb(new Error("Only .txt files are allowed!"), false);
    }
  }
}).single("description_of_proposal"); // Expect a single file with the field name 'description_of_proposal'

module.exports = partnershipfileupload;
