const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const clientHandler = require('./routeHandler/clientHandler');
const peopleHandler = require('./routeHandler/peopleHandler');
const {upload} = require('./Middle/upload')
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes for client site 
app.use("/db", clientHandler);








// Create a POST route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    console.log('uploading...');
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error });
  }
});


// Routes for handling user and editor
app.use("/user", peopleHandler);

// Error handler middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
