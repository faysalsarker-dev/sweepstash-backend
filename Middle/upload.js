const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Define the upload directory
const uploadDir = path.resolve(__dirname, '../img');

// Ensure the upload directory exists
const ensureDirExists = promisify(fs.mkdir);
ensureDirExists(uploadDir, { recursive: true }).catch(err => console.error('Error creating upload directory:', err));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileName = `${uniqueSuffix}-${file.originalname}`;
    const fullFilePath = path.join(uploadDir, fileName);
    
    console.log(`File saved at: ${fullFilePath}`); // Log the file path

    cb(null, fileName); // Store just the file name
  },
});

// File upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF files are allowed.'));
    }
  },
});

// Export the upload middleware
module.exports = { upload };
