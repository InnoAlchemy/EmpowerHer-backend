const multer = require("multer");
const path = require("path");

// Set up storage for all file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "text-uploads"); // Destination folder for all file uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E8); // Generate a unique filename
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with its original extension
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
  "application/msword", // Word documents (.doc)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word (.docx)
  "application/vnd.ms-excel", // Excel (.xls)
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel (.xlsx)
  "application/zip",
  "application/x-rar-compressed"
];

// Create the multer upload instance
const nominationfileupload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("File type not allowed!"), false); // Reject unsupported file types
    }
  }
}).single("reason_for_nomination"); // Expect a single file with the field name 'reason_for_nomination'

module.exports = nominationfileupload;
