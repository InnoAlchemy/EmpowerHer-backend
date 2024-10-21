const multer = require("multer");
const path = require("path");

// Set up storage for all files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "text-uploads"); // Destination folder for uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9); // Generate a unique filename
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with unique name and extension
  }
});

// Allowed MIME types for different file types
const allowedMimes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword", // Word documents
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word (.docx)
  "application/vnd.ms-excel", // Excel
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel (.xlsx)
  "application/zip",
  "application/x-rar-compressed"
];

// Create the multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed!"), false); // Reject files with unsupported MIME types
    }
  }
}).single("content"); // Expect a single file with the field name 'content'

module.exports = upload;
