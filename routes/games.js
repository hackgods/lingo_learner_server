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
  "french": { // French translations
      "White": "Blanc",
      "Black": "Noir",
      "Grey": "Gris",
      "Yellow": "Jaune",
      "Red": "Rouge",
      "Blue": "Bleu",
      "Green": "Vert",
      "Brown": "Marron",
      "Pink": "Rose",
      "Orange": "Orange",
      "Purple": "Violet"
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
    { name: 'Dog', value: 'https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg' },
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
      Dog: "Perro/Perra",
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
    french: {
      Dog: "Chien/Chienne",
      Lion: "Lion",
      Elephant: "Éléphant",
      Tiger: "Tigre",
      Giraffe: "Girafe",
      Monkey: "Singe",
      Zebra: "Zèbre",
      Kangaroo: "Kangourou",
      Penguin: "Penguin",
      Panda: "Panda",
      Gorilla: "Gorille",
    },
    hindi: {
      Dog: "कुत्ता",
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



 //fruits games
 const fruitOptions = [
  { name: 'Apple', value: 'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=1.00xw:0.631xh;0.00160xw,0.206xh&resize=1200:*' },
  { name: 'Banana', value: 'https://images.everydayhealth.com/images/diet-nutrition/all-about-bananas-nutrition-facts-health-benefits-recipes-and-more-rm-722x406.jpg?w=1110' },
  { name: 'Orange', value: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Ambersweet_oranges.jpg' },
  { name: 'Strawberry', value: 'https://www.farmersalmanac.com/wp-content/uploads/2021/03/Strawberry-tops.jpeg' },
  { name: 'Grapes', value: 'https://www.thedailymeal.com/img/gallery/what-really-happens-when-you-eat-grapes-every-day/intro-1666892024.jpg' },
  { name: 'Mango', value: 'https://c4.wallpaperflare.com/wallpaper/594/281/79/8k-uhd-8k-fruit-mango-wallpaper-preview.jpg' },
  { name: 'Pineapple', value: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGluZWFwcGxlfGVufDB8fDB8fHww&w=1000&q=80' },
  { name: 'Watermelon', value: 'https://c4.wallpaperflare.com/wallpaper/72/665/231/4k-watermelon-wallpaper-preview.jpg' },
  { name: 'Cherry', value: 'https://plus.unsplash.com/premium_photo-1688671920096-2ba0e36373d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
  { name: 'Pear', value: 'https://w0.peakpx.com/wallpaper/1022/374/HD-wallpaper-pears-on-a-tree-fruit-pears-tree-leaves-food-green-yellow.jpg' },
  { name: 'Papaya', value: 'https://hips.hearstapps.com/hmg-prod/images/papaya-fruit-royalty-free-image-1690494910.jpg?crop=0.66635xw:1xh;center,top&resize=980:*' }

];

const fruitTranslations = {
  spanish: {
    Apple: "Manzana",
    Banana: "Plátano",
    Orange: "Naranja",
    Strawberry: "Fresa",
    Grapes: "Uvas",
    Mango: "Mango",
    Pineapple: "Piña",
    Watermelon: "Sandía",
    Cherry: "Cereza",
    Pear: "Pera",
    Papaya: "Papaya",
  },
  french: {
    Apple: "Pomme",
    Banana: "Banane",
    Orange: "Orange",
    Strawberry: "Fraise",
    Grapes: "Raisin",
    Mango: "Mangue",
    Pineapple: "Ananas",
    Watermelon: "Pastèque",
    Cherry: "Cerise",
    Pear: "Poire",
    Papaya: "Papaye",
  },
  hindi: {
    Apple: "सेब",
    Banana: "केला",
    Orange: "संतरा",
    Strawberry: "स्ट्रॉबेरी",
    Grapes: "अंगूर",
    Mango: "आम",
    Pineapple: "अनानास",
    Watermelon: "तरबूज",
    Cherry: "चेरी",
    Pear: "नाशपाती",
    Papaya: "पपीता",
  },
};





//missing word game

const hiSentences = [
  {
    sentence: 'वह लड़की _ स्कूल जाती है।',
    correctAnswer: 'हर',
    options: ['हर', 'चाय', 'अपना बैग', 'चुपचाप', 'अचानक'],
  },
  {
    sentence: 'मुझे _ पसंद है।',
    correctAnswer: 'चाय',
    options: ['हर', 'चाय', 'अपना बैग', 'चुपचाप', 'अचानक'],
  },
  {
    sentence: 'उसने _ खो दिया।',
    correctAnswer: 'अपना बैग',
    options: ['हर', 'चाय', 'अपना बैग', 'चुपचाप', 'अचानक'],
  },
  {
    sentence: 'वह उसे _ देख रहा था।',
    correctAnswer: 'चुपचाप',
    options: ['हर', 'चाय', 'अपना बैग', 'चुपचाप', 'अचानक'],
  },
  {
    sentence: 'मैं _ बारिश में भीग गया।',
    correctAnswer: 'अचानक',
    options: ['हर', 'चाय', 'अपना बैग', 'चुपचाप', 'अचानक'],
  },
  {
    sentence: 'उसने _ खरीदी।',
    correctAnswer: 'नई किताब',
    options: ['नई किताब', 'चश्मा', 'कृपया', 'अपने', 'गाना'],
  },
  {
    sentence: 'मेरा _ तोड़ दिया।',
    correctAnswer: 'चश्मा',
    options: ['नई किताब', 'चश्मा', 'कृपया', 'अपने', 'गाना'],
  },
  {
    sentence: '_ जल्दी आओ।',
    correctAnswer: 'कृपया',
    options: ['नई किताब', 'चश्मा', 'कृपया', 'अपने', 'गाना'],
  },
  {
    sentence: 'वह _ घर गया।',
    correctAnswer: 'अपने',
    options: ['नई किताब', 'चश्मा', 'कृपया', 'अपने', 'गाना'],
  },
  {
    sentence: 'यह _ मेरी पसंदीदा है।',
    correctAnswer: 'गाना',
    options: ['नई किताब', 'चश्मा', 'कृपया', 'अपने', 'गाना'],
  },
  {
    sentence: '_ दिन अच्छा था।',
    correctAnswer: 'आज',
    options: ['आज', 'नीले', 'उसे', 'यह', 'समोसा'],
  },
  {
    sentence: 'वह _ समुंदर में तैर रहा था।',
    correctAnswer: 'नीले',
    options: ['आज', 'नीले', 'उसे', 'यह', 'समोसा'],
  },
  {
    sentence: 'मुझे _ देखकर खुशी हुई।',
    correctAnswer: 'उसे',
    options: ['आज', 'नीले', 'उसे', 'यह', 'समोसा'],
  },
  {
    sentence: '_ कुत्ता बहुत प्यारा है।',
    correctAnswer: 'यह',
    options: ['आज', 'नीले', 'उसे', 'यह', 'समोसा'],
  },
  {
    sentence: 'वह _ खा रही है।',
    correctAnswer: 'समोसा',
    options: ['आज', 'नीले', 'उसे', 'यह', 'समोसा'],
  }  
];

const enSentences = [
  {
    sentence: 'The fish _ in the water.',
    correctAnswer: 'are',
    options: ['are', 'did', 'Several', 'to', 'cannot', 'come'],
  },
  {
    sentence: 'You _ a great job!',
    correctAnswer: 'did',
    options: ['are', 'did', 'Several', 'to', 'little', 'inside'],
  },
  {
    sentence: '_ cars are parked outside.',
    correctAnswer: 'Several',
    options: ['are', 'did', 'Several', 'to', 'are', 'My'],
  },
  {
    sentence: 'He wants _ go home.',
    correctAnswer: 'to',
    options: ['are', 'did', 'Several', 'to', 'are', 'Why'],
  },
  {
    sentence: 'We _ watching a movie.',
    correctAnswer: 'are',
    options: ['are', 'did', 'Several', 'to', 'do not', 'am'],
  },
  {
    sentence: 'They _ the game.',
    correctAnswer: 'won',
    options: ['won', 'Paris', 'lift', 'Are', 'is', 'inside'],
  },
  {
    sentence: '_ is the capital of France.',
    correctAnswer: 'Paris',
    options: ['won', 'Paris', 'lift', 'Are', 'is', 'lose'],
  },
  {
    sentence: 'He can _ the box.',
    correctAnswer: 'lift',
    options: ['won', 'Paris', 'lift', 'Are', 'is', 'say'],
  },
  {
    sentence: '_ you coming to the party?',
    correctAnswer: 'Are',
    options: ['won', 'Paris', 'lift', 'Are', 'is', 'Why'],
  },
  {
    sentence: 'She _ very tall.',
    correctAnswer: 'is',
    options: ['won', 'Paris', 'lift', 'Are', 'is', 'no'],
  },
  {
    sentence: 'We _ to school every day.',
    correctAnswer: 'go',
    options: ['go', 'weather', 'left', 'close', 'My', 'fine'],
  },
  {
    sentence: 'The _ is beautiful today.',
    correctAnswer: 'weather',
    options: ['go', 'weather', 'left', 'close', 'My', 'can not'],
  },
  {
    sentence: 'She _ her keys at home.',
    correctAnswer: 'left',
    options: ['go', 'weather', 'left', 'close', 'My', 'Why'],
  },
  {
    sentence: 'Can you _ the door?',
    correctAnswer: 'close',
    options: ['go', 'weather', 'left', 'close', 'My', 'heavy'],
},
{
    sentence: '_ dog loves to play.',
    correctAnswer: 'My',
    options: ['go', 'weather', 'left', 'close', 'My', 'happy'],
},
{
    sentence: 'They _ eat meat.',
    correctAnswer: 'do not',
    options: ['do not', 'expression', 'want', 'Can', 'is', 'fresh'],
},
{
    sentence: 'The _ on his face was priceless.',
    correctAnswer: 'expression',
    options: ['do not', 'expression', 'want', 'Can', 'is', 'curious'],
},
{
    sentence: 'I _ to see that movie.',
    correctAnswer: 'want',
    options: ['do not', 'expression', 'want', 'Can', 'is', 'eager'],
},
{
    sentence: '_ you please pass the salt?',
    correctAnswer: 'Can',
    options: ['do not', 'expression', 'want', 'Can', 'is', 'polite'],
},
{
    sentence: 'She _ always on time.',
    correctAnswer: 'is',
    options: ['do not', 'expression', 'want', 'Can', 'is', 'punctual'],
},
{
    sentence: '_ should take responsibility.',
    correctAnswer: 'Everyone',
    options: ['Everyone', 'chased', 'saw', 'Whose', 'good', 'responsible'],
},
{
    sentence: 'The cat _ the mouse.',
    correctAnswer: 'chased',
    options: ['Everyone', 'chased', 'saw', 'Whose', 'good', 'small'],
},
{
    sentence: 'I _ you at the party.',
    correctAnswer: 'saw',
    options: ['Everyone', 'chased', 'saw', 'Whose', 'good', 'interesting'],
},
{
    sentence: '_ book is this?',
    correctAnswer: 'Whose',
    options: ['Everyone', 'chased', 'saw', 'Whose', 'good', 'mysterious'],
},
{
    sentence: 'They are _ friends.',
    correctAnswer: 'good',
    options: ['Everyone', 'chased', 'saw', 'Whose', 'good', 'loyal'],
}

];


//listening translations
const voiceSpanishTranslations = [
  {
    word: 'hola',
    options: ['hello', 'goodbye', 'how are you', 'thank you'],
    correctAnswer: 'hello',
  },
  {
    word: 'gato',
    options: ['dog', 'cat', 'horse', 'bird'],
    correctAnswer: 'cat',
  },
  {
    word: 'perro',
    options: ['cat', 'dog', 'rabbit', 'fish'],
    correctAnswer: 'dog',
  },
  {
    word: 'casa',
    options: ['house', 'car', 'tree', 'beach'],
    correctAnswer: 'house',
  },
  {
    word: 'árbol',
    options: ['tree', 'flower', 'river', 'mountain'],
    correctAnswer: 'tree',
  },
  {
    word: 'sol',
    options: ['moon', 'star', 'sun', 'cloud'],
    correctAnswer: 'sun',
  },
  {
    word: 'luna',
    options: ['star', 'cloud', 'moon', 'sun'],
    correctAnswer: 'moon',
  },
  {
    word: 'agua',
    options: ['fire', 'air', 'water', 'earth'],
    correctAnswer: 'water',
  },
  {
    word: 'fuego',
    options: ['water', 'fire', 'earth', 'wind'],
    correctAnswer: 'fire',
  },
  {
    word: 'aire',
    options: ['earth', 'air', 'wind', 'fire'],
    correctAnswer: 'air',
  },
  {
    word: 'tierra',
    options: ['earth', 'water', 'fire', 'air'],
    correctAnswer: 'earth',
  },
  {
    word: 'rojo',
    options: ['green', 'blue', 'yellow', 'red'],
    correctAnswer: 'red',
  },
  {
    word: 'azul',
    options: ['red', 'blue', 'yellow', 'green'],
    correctAnswer: 'blue',
  },
  {
    word: 'verde',
    options: ['yellow', 'green', 'blue', 'red'],
    correctAnswer: 'green',
  },
  {
    word: 'amarillo',
    options: ['green', 'red', 'yellow', 'blue'],
    correctAnswer: 'yellow',
  },
  {
    word: 'blanco',
    options: ['black', 'white', 'gray', 'brown'],
    correctAnswer: 'white',
  },
  {
    word: 'negro',
    options: ['white', 'black', 'gray', 'brown'],
    correctAnswer: 'black',
  },
  {
    word: 'gris',
    options: ['gray', 'brown', 'black', 'white'],
    correctAnswer: 'gray',
  },
  {
    word: 'marrón',
    options: ['brown', 'black', 'gray', 'white'],
    correctAnswer: 'brown',
  },
  {
    word: 'uno',
    options: ['two', 'one', 'three', 'four'],
    correctAnswer: 'one',
  },
  {
    word: 'dos',
    options: ['one', 'two', 'four', 'three'],
    correctAnswer: 'two',
  },
  {
    word: 'tres',
    options: ['one', 'two', 'three', 'four'],
    correctAnswer: 'three',
  },
  {
    word: 'cuatro',
    options: ['one', 'two', 'four', 'three'],
    correctAnswer: 'four',
  },
  {
    word: 'mesa',
    options: ['table', 'chair', 'bed', 'sofa'],
    correctAnswer: 'table',
  },
  {
    word: 'silla',
    options: ['sofa', 'bed', 'table', 'chair'],
    correctAnswer: 'chair',
  },
  {
    word: 'cama',
    options: ['chair', 'bed', 'sofa', 'table'],
    correctAnswer: 'bed',
  },
];


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


// Route to get fruits game
router.get("/fruits", requireAuth, async (req, res) => {
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
    if (fruitTranslations[learningLanguage]) {
      const translatedFruits = fruitOptions.map((fruit) => ({
        name: fruitTranslations[learningLanguage][fruit.name] || fruit.name,
        value: fruit.value,
      }));
      return res.json(translatedFruits);
    } else {
      // If translations don't exist for the user's learning language, return the fruits in English
      return res.json(fruitOptions);
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "Internal server error" });
  }
});  




// Route to get missing word game
router.get('/missingword', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWTPVTKEY);
    const userEmail = decoded.email;

    const userProfile = await User.findOne({ email: userEmail });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Get the user's current learning language
    const learningLanguage = userProfile.currentLearningLanguage;

    let sentencesToUse = [];

    if (learningLanguage === 'english') {
      sentencesToUse = enSentences;
    } else if (learningLanguage === 'hindi') {
      sentencesToUse = hiSentences;
    }

    // Shuffle the sentences randomly
    const shuffledSentences = sentencesToUse.sort(() => 0.5 - Math.random());

    const randomSentences = shuffledSentences.slice(0, 10).map((sentence) => {
      return {
        sentence: sentence.sentence,
        correctAnswer: sentence.correctAnswer,
        options: sentence.options,
      };
    });

    res.json(randomSentences);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to get listening game
router.get('/listening', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWTPVTKEY);
    const userEmail = decoded.email;

    const userProfile = await User.findOne({ email: userEmail });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Get the user's current learning language
    const learningLanguage = userProfile.currentLearningLanguage;

    let sentencesToUse = [];

    if (learningLanguage === 'english') {
      sentencesToUse = voiceSpanishTranslations;
    } else if (learningLanguage === 'spanish') {
      sentencesToUse = voiceSpanishTranslations;
    }

    // Shuffle the sentences randomly
    const shuffledSentences = sentencesToUse.sort(() => 0.5 - Math.random());

    const randomSentences = shuffledSentences.slice(0, 10).map((sentence) => {
      return {
        word: sentence.word,
        correctAnswer: sentence.correctAnswer,
        options: sentence.options,
      };
    });

    res.json(randomSentences);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;