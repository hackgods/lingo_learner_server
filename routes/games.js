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

//colors games
const colorOptions = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Grey', value: '#9E9E9E' },
    { name: 'Yellow', value: '#FFEB3B' },
    { name: 'Red', value: '#D50000' },
    { name: 'Blue', value: '#03A9F4' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Brown', value: '#795548' },
    { name: 'Pink', value: '#EC407A' },
    { name: 'Orange', value: '#F4511E' },
    { name: 'Purple', value: '#9C27B0' },
];


const colorsTranslations = {
    "spanish": { // Spanish translations
        "White": "Blanco",
        "Black": "Negro",
        "Grey": "Gris",
        "Yellow": "Amarillo",
        "Red": "Rojo",
        "Blue": "Azul",
        "Green": "Verde",
        "Brown": "Marrón",
        "Pink": "Rosa",
        "Orange": "Naranja",
        "Purple": "Morado"
    },
    "hindi": { // Hindi translations
        "White": "सफेद",
        "Black": "काला",
        "Grey": "धूसर",
        "Yellow": "पीला",
        "Red": "लाल",
        "Blue": "नीला",
        "Green": "हरा",
        "Brown": "भूरा",
        "Pink": "गुलाबी",
        "Orange": "नारंगी",
        "Purple": "बैंगनी"
    }
};

//animals games

const animalOptions = [
    { name: 'Lion', value: 'https://cf.shopee.ph/file/dac4c82fe9e922f76ce051f48c15cdec' },
    { name: 'Elephant', value: 'https://a-z-animals.com/media/2019/11/Elephant-male-1024x535.jpg' },
    { name: 'Tiger', value: 'https://cdn-acgla.nitrocdn.com/bvIhcJyiWKFqlMsfAAXRLitDZjWdRlLX/assets/static/optimized/rev-5131b73/wp-content/uploads/2020/07/Bengal-tiger-1.jpg' },
    { name: 'Giraffe', value: 'https://a-z-animals.com/media/2022/11/shutterstock_1557735749-1024x614.jpg' },
    { name: 'Monkey', value: 'https://a-z-animals.com/media/2022/09/shutterstock_1754084492-1024x683.jpg' },
    { name: 'Zebra', value: 'https://a-z-animals.com/media/animals/images/original/zebra.jpg' },
    { name: 'Kangaroo', value: 'https://cdn.britannica.com/90/140490-050-669A124D/Red-kangaroo-home-range-species-much-interior.jpg' },
    { name: 'Penguin', value: 'https://a-z-animals.com/media/Penguin-Aptenodytes-Forsteri-walking-on-beach.jpg' },
    { name: 'Panda', value: 'https://worldanimalfoundation.org/wp-content/uploads/2023/02/What-do-Pandas-Look-Like-review.jpg' },
    { name: 'Gorilla', value: 'https://a-z-animals.com/media/Western-lowland-gorilla-3.jpg' },
  ];

  const animalTranslations = {
    spanish: {
      Lion: "León",
      Elephant: "Elefante",
      Tiger: "Tigre",
      Giraffe: "Jirafa",
      Monkey: "Mono",
      Zebra: "Cebra",
      Kangaroo: "Canguro",
      Penguin: "Pingüino",
      Panda: "Panda",
      Gorilla: "Gorila",
    },
    hindi: {
      Lion: "सिंह",
      Elephant: "हाथी",
      Tiger: "बाघ",
      Giraffe: "जिराफ़",
      Monkey: "बंदर",
      Zebra: "ज़ेबरा",
      Kangaroo: "कंगारू",
      Penguin: "पेंगुइन",
      Panda: "पांडा",
      Gorilla: "गोरिल्ला",
    },
  };


//home of games api
router.get("/", (req, res) => {
    res.send("Hello User - Games");
});


// Route to get color game
router.get("/colors", requireAuth, async (req, res) => {
    try {
        // Decode the JWT and extract the email payload
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWTPVTKEY);
        const userEmail = decoded.email;

        // Retrieve the user's profile information from the database based on the email
        const userProfile = await User.findOne({ email: userEmail });

        // Check if user's profile exists
        if (!userProfile) {
            return res.status(404).json({ error: "User profile not found" });
        }

        // Get the user's current learning language
        const learningLanguage = userProfile.currentLearningLanguage;



        // Translate the color options to the learning language
        if (colorsTranslations[learningLanguage]) {
            const translatedColors = colorOptions.map(color => ({
                name: colorsTranslations[learningLanguage][color.name] || color.name,
                value: color.value
            }));
            return res.json(translatedColors);
        } else {
            // If translations don't exist for the user's learning language, return the colors in English
            return res.json(colorOptions);
        }
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: "Internal server error" });
    }
});


// Route to get animal game
router.get("/animals", requireAuth, async (req, res) => {
    try {
      // Decode the JWT and extract the email payload
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWTPVTKEY);
      const userEmail = decoded.email;
  
      // Retrieve the user's profile information from the database based on the email
      const userProfile = await User.findOne({ email: userEmail });
  
      // Check if user's profile exists
      if (!userProfile) {
        return res.status(404).json({ error: "User profile not found" });
      }
  
      // Get the user's current learning language
      const learningLanguage = userProfile.currentLearningLanguage;
  
      // Translate the animal options to the learning language
      if (animalTranslations[learningLanguage]) {
        const translatedAnimals = animalOptions.map((animal) => ({
          name: animalTranslations[learningLanguage][animal.name] || animal.name,
          value: animal.value,
        }));
        return res.json(translatedAnimals);
      } else {
        // If translations don't exist for the user's learning language, return the animals in English
        return res.json(animalOptions);
      }
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;