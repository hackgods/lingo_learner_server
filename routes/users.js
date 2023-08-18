const express = require("express");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./schemas/userschema.js');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const passport = require('./../passportMiddleware.js');
const cookieParser = require('cookie-parser');
require("dotenv").config();

//todays date ddmmyyyy
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
const formattedToday = yyyy + '-' + mm + '-' + dd;

router.use(cookieParser());
router.use(passport.initialize());

//home of user api
router.get("/", (req, res) => {
    res.send("Hello -User");
});

//create new user
router.post("/signup", async (req, res) => {
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        const userReq = req.body;
        const user = await User.create({
            ...userReq,
            createdDate: formattedToday,
            password: newPassword
        });
        res.json({ status: 'ok' });
    } catch (err) {
        res.json({ status: 'error' })
    }
});

//sign in user with email and pass
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        // Handle any errors that occurred during authentication
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (!user) {
        // Handle invalid login credentials
        return res.status(401).json({ error: 'Invalid login credentials' });
      }
  
      req.login(user, { session: false }, (err) => {
        if (err) {
          // Handle any errors that occurred during login
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        const token = jwt.sign(
          {
            name: user.firstName,
            email: user.email,
          },
          process.env.JWTPVTKEY,
          { expiresIn: '7d' }
        );
  
        return res.json({ status: 'ok', user: token });
      });
    })(req, res, next);
  });

  

//verify user profile
router.get("/profile", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
      // Decode the JWT and extract the email payload
      const token = req.headers.authorization.split(" ")[1]; // Assuming the JWT is provided in the "Authorization" header as "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWTPVTKEY);
      const userEmail = decoded.email;
  
      // Retrieve the user's profile information from the database based on the email
      const userProfile = await User.findOne({ email: userEmail });
  
      // If the profile doesn't exist, return an error
      if (!userProfile) {
        return res.status(404).json({ error: "User profile not found" });
      }
  
      // Return the user's profile information
      res.json(userProfile);
    } catch (error) {
      // Handle any errors that occur during the profile retrieval process
      res.status(500).json({ error: "Internal server error" });
    }
  });


//update user profile
// Update user information
router.put("/profile", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    // Decode the JWT and extract the email payload
    const token = req.headers.authorization.split(" ")[1]; // Assuming the JWT is provided in the "Authorization" header as "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWTPVTKEY);
    const userEmail = decoded.email;

    // Retrieve the user's profile information from the database based on the email
    const userProfile = await User.findOne({ email: userEmail });

    // If the profile doesn't exist, return an error
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Update the user's profile information
    userProfile.firstName = req.body.firstName || userProfile.firstName;
    userProfile.lastName = req.body.lastName || userProfile.lastName;
    userProfile.gender = req.body.gender || userProfile.gender;
    userProfile.email = req.body.email || userProfile.email;
    userProfile.currentLearningLanguage = req.body.currentLearningLanguage || userProfile.currentLearningLanguage;
    userProfile.password = req.body.password || userProfile.password;
    
    // Update other fields as needed

    // Save the updated user profile
    await userProfile.save();

    // Return the updated user's profile information
    res.json(userProfile);
  } catch (error) {
    // Handle any errors that occur during the profile update process
    res.status(500).json({ error: "Internal server error" });
  }
});



router.put('/update-points', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Decode the JWT and extract the email payload
    const token = req.headers.authorization.split(' ')[1]; // Assuming the JWT is provided in the "Authorization" header as "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWTPVTKEY);
    const userEmail = decoded.email;

    // Retrieve the user's profile information from the database based on the email
    const userProfile = await User.findOne({ email: userEmail });

    // If the profile doesn't exist, return an error
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Check if the request body includes a 'pointsToAdd' field
    if (!req.body.points || typeof req.body.points !== 'number') {
      return res.status(400).json({ error: 'Invalid points value' });
    }

    // Add the pointsToAdd value to the existing points
    userProfile.points += req.body.points;

    // Save the updated user profile
    await userProfile.save();

    // Return the updated user's profile information
    res.json(userProfile);
  } catch (error) {
    // Handle any errors that occur during the points update process
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;