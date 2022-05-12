'use strict';
// load npm modules
const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const flash = require("express-flash");
const cors = require('cors');
const cookieSession = require("cookie-session");
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

require('dotenv/config');

const authenticateUser = require("./auth");

const BASE_URL = process.env.BASE_URL

const app = express();

// create a rotating write stream for logging
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});

//----------MIDDLEWARES----------//
//we are using them to execute some packages like below or ex auth

app.use(cors());
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 
//app.use(express.urlencoded({ extened: true }));
app.set("view engine", "ejs");
app.use(flash());
// used for authentication
app.use(cookieSession({keys: [process.env.COOKIE_KEY]}));
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));


//----------ROUTES----------//
// Routes for serving frontend files

// LOGIN STARTED ROUTE

app.get('/', async(req,res) => { res.render('login') });

//--------------------------//

app.post('/auth', (req, res) => {
    try{
        const { username, password } = req.body;
        username.toLowerCase();
        // check for missing filds
        if (!username || !password) {
            return res.render("login", { message: "Please enter all the fields" });
        }

        if (username !== process.env.ADMINISTRATOR_USER || password !== process.env.ADMINISTRATOR_PASS) {
            res.send("invalid username or password");
            return;
        } else {
            const doesUserExits = true;
        }

        if (!doesUserExits) {
            res.send("invalid username or password");
            return;
        }
          // else he\s logged in
        req.session.user = {
            username,
        };
       
        res.render("home");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/home', authenticateUser, (req, res) => {
    res.render("home");
});

//--------------------------//






//--------------------------//

//logout - kill current session
app.get('/logout', authenticateUser, (req, res) => {
    req.session.user = null;
    res.redirect('/');
  });

//----------HTTP SERVER----------//
const PORT = process.env.ADM_PORT || 6700;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
