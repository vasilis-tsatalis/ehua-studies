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
const requests_modules = require("./admin_requests");

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


// Generic Usage Function
function create_requests(fullname, route_w){

    fs.readFile(fullname, function(err, data) {
        if (err) {
            res.sendStatus(501).json({ message:err });
        }

        const roles = JSON.parse(data);
        //console.log(roles)

        if (roles) {

            roles.forEach(element => {

                //console.log(element)

                requests_modules.create_data(route_w, element)
                .then(item => {
                    console.log(item)
                })
                .catch(err => {
                    console.log(err)
                });

            })
        }

        requests_modules.get_data(route_w)
        .then(data => {console.log(data)})
        .catch(err => {
            console.log('Error: ' + err)
            });
        
    });

};


//----------ROUTES----------//
// Routes for serving frontend files

// LOGIN STARTED ROUTE

app.get('/', async(req,res) => { res.render('login') });

//--------------------------//

app.get('/home', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.render("home", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/departments', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        create_requests("./data/roles_types.json", '/roles_types');

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/classrooms', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        create_requests("./data/classrooms_types.json", '/classrooms_types');

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/doc_types', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        create_requests("./data/roles_types.json", '/roles_types');

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/exams', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        create_requests("./data/roles_types.json", '/roles_types');

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/schedulers', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        create_requests("./data/roles_types.json", '/roles_types');

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/semesters', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        create_requests("./data/roles_types.json", '/roles_types');

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/roles', authenticateUser, async (req, res) => {

    try{
        const username = req.session.user.username;

        create_requests("./data/roles_types.json", '/roles_types');

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/students', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.redirect('/logout');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/professors', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.redirect('/logout');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/courses', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.redirect('/logout');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/documents', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.redirect('/logout');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/sections', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.redirect('/logout');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.post('/signin', async (req, res) => {
    try{
        const { username, password } = req.body;
        username.toLowerCase();
        // check for missing filds
        if (!username || !password) {
            return res.render("login", { message: "Please enter all the fields" });
        };
        if (username != process.env.ADMINISTRATOR_USER || password != process.env.ADMINISTRATOR_PASS) {
            res.send("invalid username or password");
            return;
        };
        req.session.user = {
            username,
        };     
        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

//--------------------------//

//logout - kill current session
app.get('/logout', authenticateUser, async (req, res) => {
    req.session.user = null;
    res.redirect('/');
  });

//----------HTTP SERVER----------//
const PORT = process.env.ADM_PORT || 6700;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
