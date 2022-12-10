const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const Feusers = require('../models/Feusers');

require('dotenv/config');

//----------RUN & CONNECT DB----------//
//connect to mongodb
//here is a promise
mongoose.connect(process.env.DB_CONNECTION);

const db = mongoose.connection;
db.on('error', console.log.bind(console, "MongoDB connection error"));
db.once('open', function(callback){
    console.log("MongoDB connection succeeded");
});

//----------ROUTES----------//

router.get('/', async (req, res) => {
    try{
        res.render("signup");
    }catch(err){
        res.sendStatus(503).json({ message:err });
    }
});


router.post('/', async (req, res) => {
    try{
        const { username, email, password, password2, role } = req.body;

        //console.log(req.body);

        username.toLowerCase();

          // check for missing filds
        if (!username || !password || !email || !password2 || !role) {
            return res.render("signup", { message: "Please enter all the fields" });
        }

        // check same password
        if (password !== password2) {
            return res.render("signup", { message: "Password must be the same in both fields" });
        }

        const user = await Feusers.findOne({ username: `${username.toLowerCase()}`, email: `${email.toLowerCase()}` }).exec();
        if (user) {
            console.log(user);
            //res.render("signin", { message: "User exists!!!" });
            res.redirect('/');
        };

        if (role === 'professor') {   

            // Check user in the backend
            await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/username/${username}`, {
                auth: {
                    username: `${process.env.API_USER}`,
                    password: `${process.env.API_PASS}`
                }
            })
            .then(response => {
                    const metadata = response.data;
                    console.log(metadata);
                    if ((username.toLowerCase() === metadata.username.toLowerCase()) && (email.toLowerCase() === metadata.email.toLowerCase())) {
                        const refcode = metadata.id;

                        const user_data = {
                            "username": username.toLowerCase(),
                            "email": email.toLowerCase(),
                            "password": password,
                            "role": role,
                            "refcode": refcode.toString(),
                        };

                        db.collection('feusers').insertOne(user_data, (err, res) => {
                            if (err) throw err;
                            console.log("User inserted Successfully");
                            //console.log(res);    
                        });

                        res.render("signin", { message: "User has been created!!!" });
                    }
            })
            .catch(err => { 
                console.log(err);
                res.sendStatus(404).json({ message:err });
                });

        } else if (role === 'student') {

            // Check user in the backend
            await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students/username/${username}`, {
                auth: {
                    username: `${process.env.API_USER}`,
                    password: `${process.env.API_PASS}`
                }
            })
            .then(response => {
                    const metadata = response.data;
                    //console.log(metadata);
                    if ((username.toLowerCase() === metadata.username.toLowerCase()) && (email.toLowerCase() === metadata.email.toLowerCase())) {
                        const refcode = metadata.id;

                        const user_data = {
                            "username": username.toLowerCase(),
                            "email": email.toLowerCase(),
                            "password": password,
                            "role": role,
                            "refcode": refcode.toString()
                        };

                        db.collection('feusers').insertOne(user_data, (err, res) => {
                            if (err) throw err;
                            console.log("User inserted Successfully");
                            //console.log(res);    
                        });

                        res.render("signin", { message: "User has been created!!!" });
                    }
            })
            .catch(err => { 
                console.log(err);
                res.sendStatus(404).json({ message:err });
            });

        } else {
            res.sendStatus(403).json({ message:err });
        }
     
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;