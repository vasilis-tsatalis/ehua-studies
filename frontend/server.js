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

const authenticateUser = require("./middleware/auth/authentication");

// const BASE_URL = process.env.BASE_URL;

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

app.get('/', async(req,res) => { res.render('signin') });

const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

const studentsRoute = require('./routes/students');
app.use('/students', studentsRoute);

const professorsRoute = require('./routes/professors');
app.use('/professors', professorsRoute);

const sectionsRoute = require('./routes/sections');
app.use('/sections', sectionsRoute);

const documentsRoute = require('./routes/documents');
app.use('/documents', documentsRoute);

const uploadRoute = require('./routes/upload');
app.use('/upload', uploadRoute);

const contactRoute = require('./routes/contact');
app.use('/contact', contactRoute);

const resultRoute = require('./routes/result');
app.use('/results', resultRoute);

const accountRoute = require('./routes/account');
app.use('/account', accountRoute);

// // // // // // // // // // 
const departmentsRoute = require('./routes/departments');
app.use('/departments', departmentsRoute);

const docs_typeRoute = require('./routes/docs_type');
app.use('/docs_types', docs_typeRoute);

const classroomsRoute = require('./routes/classrooms');
app.use('/classrooms', classroomsRoute);

const examsRoute = require('./routes/exams');
app.use('/exams', examsRoute);

const semestersRoute = require('./routes/semesters');
app.use('/semesters', semestersRoute);

const schedulersRoute = require('./routes/schedulers');
app.use('/schedulers', schedulersRoute);

const coursesRoute = require('./routes/courses');
app.use('/courses', coursesRoute);

// // // // // // // // // // 
const uploaded_documentsRoute = require('./routes/uploaded_documents');
app.use('/uploaded_documents', uploaded_documentsRoute);

//--------------------------//

//logout - kill current session
app.get('/logout', authenticateUser, (req, res) => {
    req.session.user = null;
    res.redirect('/');
  });


//----------HTTP SERVER----------//
const PORT = process.env.FE_PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
