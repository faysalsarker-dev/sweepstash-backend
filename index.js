const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const clientHandler = require('./routeHandler/clientHandler');
const peopleHandler = require('./routeHandler/peopleHandler');
const dashboardHandler = require('./routeHandler/dashboard')
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');


// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


  app.use('/images', express.static(path.resolve(__dirname, './img')));

app.get('/',async(req,res)=>{
  res.send(`sarver is running on ${port}`)
})








// Routes for client site 
app.use("/db", clientHandler);


// Routes for handling user and editor
app.use("/user", peopleHandler);

app.use('/dashboard',dashboardHandler)


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
