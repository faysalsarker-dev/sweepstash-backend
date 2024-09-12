const express = require('express');
const mongoose = require('mongoose');
const { User } = require('../Shcemas/Shcemas'); 
const router = express.Router();
const {HPMW}=require('./../Middle/Middleware')
const {upload} = require('./../Middle/upload')

















// Register a new user
router.post('/register', HPMW,upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let profile = '';
    if (req.file) {
      profile = req.file.filename;
    }
    console.log('Request Data:', name, email, password, role,'profile',profile);
    // Create a new user
    const newUser = new User({ name, email, password, role, profile });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.log(error);
  }
});


// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.error('Error:', error);
  }
});

module.exports = router;
