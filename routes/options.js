const express = require("express");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const passport = require('./../passportMiddleware.js');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const User = require('./schemas/userschema.js');



// Middleware to protect routes
const requireAuth = passport.authenticate("jwt", { session: false });


// Route to change user's learning language
router.put('/changelanguage', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWTPVTKEY);
      const userEmail = decoded.email;
  
      const { newLanguage } = req.body;
  
      // List of valid languages
      const validLanguages = ['english', 'spanish', 'hindi', 'french'];
  
      if (!validLanguages.includes(newLanguage)) {
        return res.status(400).json({ error: 'Invalid language selection' });
      }
  
      const userProfile = await User.findOneAndUpdate(
        { email: userEmail },
        { $set: { currentLearningLanguage: newLanguage } },
        { new: true }
      );
  
      if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found' });
      }
  
      res.json({ message: 'Learning language updated successfully', userProfile });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  

module.exports = router;
