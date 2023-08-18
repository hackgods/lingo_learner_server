const express = require('express');
const userRoutes = require('./routes/users.js');
const gameRoutes = require('./routes/games.js');
const optionRoutes = require('./routes/options.js');

var bodyParser = require('body-parser');
require("dotenv").config();
const cors = require("cors");
const connection = require("./db.js");

//db connection
connection();

const app = express();
const PORT = 4000;
const apiDir = "/api/v1";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true 
 }));
app.use(cors());



app.use(`${apiDir}/users`,userRoutes);
app.use(`${apiDir}/games`,gameRoutes);
app.use(`${apiDir}/options`,optionRoutes);


app.listen(PORT,function() {
    console.log(`Server started on ${PORT}`);
});

app.get("/",function(request, response) {
    response.send('Hello, welcome to Lingo Learner Server');
});

app.get(`${apiDir}`,function(request, response) {
    response.send('Hello, welcome to Lingo Learner Server');
});



