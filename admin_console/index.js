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
const base64 = require('base-64');
const axios = require('axios');

require('dotenv/config');

const authenticateUser = require("./auth");

//const BASE_URL = process.env.BASE_URL

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

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/departments`;

        const data = JSON.parse(fs.readFileSync("./data/departments.json", "utf-8"));
        const metadata = data.metadata;
        metadata.forEach(item => {
            console.log(item);

            axios.post(api_url, item, {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                },
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

        });
              
        res.redirect('/home');
        
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/classrooms', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/classrooms_types`;

        const data = JSON.parse(fs.readFileSync("./data/classrooms_types.json", "utf-8"));
        const metadata = data.metadata;
        metadata.forEach(item => {
            console.log(item);

            axios.post(api_url, item, {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                },
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

        });
        
        res.redirect('/home');
        
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/doc_types', authenticateUser, async (req, res) => {
    try{

        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/documents_types`;

        const data = JSON.parse(fs.readFileSync("./data/documents_types.json", "utf-8"));
        const metadata = data.metadata;
        metadata.forEach(item => {
            console.log(item);

            axios.post(api_url, item, {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                },
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

        });
        
        res.redirect('/home');

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/exams', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/exams_types`;

        const data = JSON.parse(fs.readFileSync("./data/exams_types.json", "utf-8"));
        const metadata = data.metadata;
        metadata.forEach(item => {
            console.log(item);

            axios.post(api_url, item, {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                },
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

        });
        
        res.redirect('/home');

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/schedulers', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/schedulers_types`;

        const data = JSON.parse(fs.readFileSync("./data/schedulers_types.json", "utf-8"));
        const metadata = data.metadata;
        metadata.forEach(item => {
            console.log(item);

            axios.post(api_url, item, {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                },
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

        });
        
        res.redirect('/home');

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/semesters', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/semesters_types`;

        const data = JSON.parse(fs.readFileSync("./data/semesters_types.json", "utf-8"));
        const metadata = data.metadata;
        metadata.forEach(item => {
            console.log(item);

            axios.post(api_url, item, {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                },
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

        });
        
        res.redirect('/home');

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/roles', authenticateUser, async (req, res) => {

    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/roles_types`;

        const data = JSON.parse(fs.readFileSync("./data/roles_types.json", "utf-8"));
        const metadata = data.metadata;
        metadata.forEach(item => {
            console.log(item);

            axios.post(api_url, item, {
                headers: {
                    'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                },
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

        });

        res.redirect('/home');

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/students', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students`;

        // READ CSV INTO STRING
        var data = fs.readFileSync("./migration/students.csv").toLocaleString();
        // STRING TO ARRAY
        var rows = data.split("\n"); // SPLIT ROWS
        rows.forEach((row) => {
            var columns = row.split(","); //SPLIT COLUMNS
            if(columns[1] != undefined) {

                var metadata = {
                    //id: columns[0],    // backend will create id
                    username: columns[1],
                    first_name: columns[2],
                    last_name: columns[3],
                    date_of_birth: columns[4],
                    address: columns[5],
                    city: columns[6],
                    zipcode: columns[7],
                    telephone: columns[8],
                    phone: columns[9],
                    mobile: columns[10],
                    email: columns[11],
                    year_group: columns[12],
                    //is_active: columns[13],
                    is_active: true,
                    notes: columns[14],
                    //creation_user: columns[15]
                    creation_user: username
                };
                //console.log(metadata);
                
                axios.post(api_url, metadata, {
                    headers: {
                        'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                    },
                  })
                  .then(function (response) {
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        });

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/professors', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors`;

        // READ CSV INTO STRING
        var data = fs.readFileSync("./migration/professors.csv").toLocaleString();
        // STRING TO ARRAY
        var rows = data.split("\n"); // SPLIT ROWS
        rows.forEach((row) => {
            var columns = row.split(","); //SPLIT COLUMNS
            if(columns[1] != undefined) {

                var metadata = {
                    //id: columns[0],    // backend will create id
                    username: columns[1],
                    first_name: columns[2],
                    last_name: columns[3],
                    date_of_birth: columns[4],
                    address: columns[5],
                    city: columns[6],
                    zipcode: columns[7],
                    telephone: columns[8],
                    office_phone: columns[9],
                    mobile: columns[10],
                    email: columns[11],
                    title: columns[12],
                    level: columns[13],
                    //is_active: columns[14],
                    is_active: true,
                    notes: columns[15],
                    //creation_user: columns[16]
                    creation_user: username
                };
                //console.log(metadata);
                
                axios.post(api_url, metadata, {
                    headers: {
                        'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                    },
                  })
                  .then(function (response) {
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        });

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/courses', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/courses`;

        // READ CSV INTO STRING
        var data = fs.readFileSync("./migration/courses.csv").toLocaleString();
        // STRING TO ARRAY
        var rows = data.split("\n"); // SPLIT ROWS
        rows.forEach((row) => {
            var columns = row.split(","); //SPLIT COLUMNS
            if(columns[1] != undefined) {

                var metadata = {
                    //id: columns[0],    // backend will create id
                    department_id: columns[1],
                    name: columns[2],
                    description: columns[3],
                    is_active: columns[4],
                    semester_type_id: columns[5],
                    gravity: columns[6]
                };
                //console.log(metadata);
                
                axios.post(api_url, metadata, {
                    headers: {
                        'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                    },
                  })
                  .then(function (response) {
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        });

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/documents', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/documents`;

        // READ CSV INTO STRING
        var data = fs.readFileSync("./migration/documents.csv").toLocaleString();
        // STRING TO ARRAY
        var rows = data.split("\n"); // SPLIT ROWS
        rows.forEach((row) => {
            var columns = row.split(","); //SPLIT COLUMNS
            if(columns[1] != undefined) {

                var metadata = {
                    //id: columns[0],    // backend will create id
                    professor_id: columns[1],
                    name: columns[2],
                    document_type_id: columns[3],
                    url: columns[4],
                    bucket: columns[5],
                    filename: columns[6],
                    extension: columns[7],
                    expiration_days: columns[8],
                    notes: columns[9]
                };
                //console.log(metadata);
                
                axios.post(api_url, metadata, {
                    headers: {
                        'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                    },
                  })
                  .then(function (response) {
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        });

        res.redirect('/home');
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//--------------------------//

app.get('/sections', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections`;

        // READ CSV INTO STRING
        var data = fs.readFileSync("./migration/sections.csv").toLocaleString();
        // STRING TO ARRAY
        var rows = data.split("\n"); // SPLIT ROWS
        rows.forEach((row) => {
            var columns = row.split(","); //SPLIT COLUMNS
            if(columns[1] != undefined) {

                var metadata = {
                    //id: columns[0],    // backend will create id
                    course_id: columns[1],
                    professor_id: columns[2],
                    classroom_type_id: columns[3],
                    year: columns[4],
                    exam_type_id: columns[5]
                };
                //console.log(metadata);
                
                axios.post(api_url, metadata, {
                    headers: {
                        'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
                    },
                  })
                  .then(function (response) {
                    console.log(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        });

        res.redirect('/home');
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
