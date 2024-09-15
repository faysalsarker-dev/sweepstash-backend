const express = require('express');
const { User } = require('../Shcemas/Shcemas.js'); 
const router = express.Router();

const { upload } = require('./../Middle/upload.js');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const createJwt = (email) => {
  return jwt.sign({ email }, process.env.DB_SECRET, { expiresIn: '1h' }); 
};


router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

  
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

  
    let profile = '';
    if (req.file) {
      profile = req.file.filename;
    }

    console.log('Request Data:', name, email, hashedPassword, role, 'profile', profile);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, 
      role,
      profile,
    });
    
    await newUser.save();
    const token = createJwt(email);

   
    const userResponse = {
      ...newUser._doc, 
      password: undefined,
      _id: undefined,
    };

    const fileUrl = `/img/${req.file.filename}`;
    
    res.status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.error(error);
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

  
    const token = createJwt(user.email);
    res.status(200).cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    }).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.error('Error:', error);
  }
});

module.exports = router;
